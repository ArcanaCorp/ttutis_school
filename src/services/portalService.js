import { supabase } from '../lib/supabase';

function requireClient() {
    if (!supabase) throw new Error('La conexión con TTUTIS no está configurada.');
    return supabase;
}

function throwIfError(error, fallback) {
    if (error) {
        console.error('[PORTAL]', error);
        throw new Error(fallback);
    }
}

export async function getPortalIdentity() {
    const client = requireClient();
    const { data: authData, error: authError } = await client.auth.getUser();
    throwIfError(authError, 'No se pudo validar tu sesión.');
    const user = authData?.user;
    if (!user) throw new Error('Tu sesión ha expirado. Vuelve a ingresar.');

    const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('id, display_name, avatar_path, status')
        .eq('id', user.id)
        .maybeSingle();
    throwIfError(profileError, 'No se pudo cargar tu perfil.');

    const { data: memberships, error: membershipsError } = await client
        .from('memberships')
        .select('id, institution_id, full_name, role, status')
        .eq('profile_id', user.id)
        .eq('status', 'ACTIVE');
    throwIfError(membershipsError, 'No se pudieron cargar tus permisos.');

    return {
        userId: user.id,
        fullName: profile?.display_name || memberships?.[0]?.full_name || user.email || 'Usuario TTUTIS',
        avatarPath: profile?.avatar_path || null,
        memberships: memberships || [],
        roles: [...new Set((memberships || []).map(item => item.role))],
    };
}

export async function getStudentPortalContext() {
    const client = requireClient();
    const identity = await getPortalIdentity();
    const studentMembership = identity.memberships.find(item => item.role === 'STUDENT');
    if (!studentMembership) throw new Error('Esta cuenta no tiene una matrícula de alumno activa.');

    const { data: student, error: studentError } = await client
        .from('students')
        .select('id, institution_id, membership_id, first_names, last_names, student_code, status')
        .eq('membership_id', studentMembership.id)
        .eq('status', 'ACTIVE')
        .maybeSingle();
    throwIfError(studentError, 'No se pudieron cargar tus datos de alumno.');
    if (!student) throw new Error('No encontramos un registro activo para tu cuenta.');

    const { data: enrollments, error: enrollmentError } = await client
        .from('enrollments')
        .select('id, academic_year_id, classroom_id, status, enrolled_at, ended_at, classrooms(id, level, grade_label, section_name, academic_year_id, status), academic_years(id, name, status)')
        .eq('student_id', student.id)
        .eq('status', 'ACTIVE')
        .order('enrolled_at', { ascending: false });
    throwIfError(enrollmentError, 'No se pudo cargar tu matrícula.');

    const currentEnrollment = (enrollments || []).find(item => item.classrooms?.status === 'ACTIVE') || enrollments?.[0] || null;
    return { identity, student, enrollments: enrollments || [], currentEnrollment };
}

export async function getGuardianChildren() {
    const client = requireClient();
    const identity = await getPortalIdentity();
    const { data: links, error: linksError } = await client
        .from('guardian_student_links')
        .select('id, institution_id, student_id, relationship, can_view_attendance, can_view_grades, can_view_behavior, can_view_fees, can_receive_notifications, status, students(id, first_names, last_names, student_code, status)')
        .eq('guardian_profile_id', identity.userId)
        .eq('status', 'ACTIVE');
    throwIfError(linksError, 'No se pudieron cargar los hijos vinculados a tu cuenta.');

    return (links || []).map(link => ({
        linkId: link.id,
        relationship: link.relationship,
        permissions: {
            attendance: link.can_view_attendance,
            grades: link.can_view_grades,
            behavior: link.can_view_behavior,
            fees: link.can_view_fees,
            notifications: link.can_receive_notifications,
        },
        student: link.students,
    })).filter(item => item.student?.status === 'ACTIVE');
}

export async function getStudentAnnouncements(studentId) {
    const client = requireClient();
    const now = new Date().toISOString();
    const { data, error } = await client
        .from('student_updates')
        .select('id, update_type, title, body, grade_value, priority, student_id, classroom_id, visible_from, visible_until, created_at')
        .lte('visible_from', now)
        .or(`visible_until.is.null,visible_until.gte.${now}`)
        .order('visible_from', { ascending: false });
    throwIfError(error, 'No se pudieron cargar los avisos.');
    // RLS decides which global, classroom and personal updates this account can read.
    return (data || [])
        .filter(item => !studentId || !item.student_id || item.student_id === studentId)
        .map(item => ({
            ...item,
            type: item.update_type === 'ANNOUNCEMENT' ? 'Anuncio' : item.update_type,
            message: item.body,
            date: item.visible_from,
            priority: item.priority === 'HIGH' ? 'high' : item.priority === 'MEDIUM' ? 'medium' : 'low',
        }));
}

export async function getStudentAttendance(studentId) {
    const client = requireClient();
    const { data, error } = await client
        .from('attendance_events')
        .select('id, event_type, occurred_at, attendance_status, attendance_local_date, justification_status, justification_notes')
        .eq('student_id', studentId)
        .order('occurred_at', { ascending: false })
        .limit(60);
    throwIfError(error, 'No se pudo cargar el historial de asistencia.');
    return (data || []).map(item => ({
        ...item,
        date: item.attendance_local_date,
        status: item.attendance_status === 'PRESENT' ? 'punctual'
            : item.attendance_status === 'LATE' ? 'late'
            : item.attendance_status === 'ABSENCE' ? 'absent' : 'unknown',
    }));
}

export async function getStudentAcademicData(studentId, classroomId) {
    const client = requireClient();
    if (!classroomId) return { courses: [], schedule: [], assessments: [], grades: [] };

    const { data: assignments, error: assignmentsError } = await client
        .from('course_assignments')
        .select('id, subject_id, teacher_membership_id, subjects(id, code, name, description)')
        .eq('classroom_id', classroomId)
        .eq('status', 'ACTIVE');
    throwIfError(assignmentsError, 'No se pudieron cargar tus cursos.');

    const teacherIds = [...new Set((assignments || []).map(item => item.teacher_membership_id).filter(Boolean))];
    const { data: teachers, error: teachersError } = teacherIds.length
        ? await client.from('memberships').select('id, full_name').in('id', teacherIds)
        : { data: [], error: null };
    throwIfError(teachersError, 'No se pudo cargar la información de tus docentes.');
    const teacherNames = new Map((teachers || []).map(item => [item.id, item.full_name]));

    const assignmentIds = (assignments || []).map(item => item.id);
    const { data: schedule, error: scheduleError } = assignmentIds.length
        ? await client.from('schedules')
            .select('id, weekday, start_time, end_time, classroom_label, course_assignment_id, effective_from, effective_until')
            .in('course_assignment_id', assignmentIds)
            .eq('status', 'ACTIVE')
            .order('weekday')
            .order('start_time')
        : { data: [], error: null };
    throwIfError(scheduleError, 'No se pudo cargar tu horario.');

    const { data: assessments, error: assessmentsError } = await client
        .from('classroom_assessments')
        .select('id, course_assignment_id, academic_period_id, title, description, assessment_date, maximum_score, status, weight')
        .eq('classroom_id', classroomId)
        .in('status', ['PUBLISHED', 'ACTIVE'])
        .order('assessment_date', { ascending: false });
    throwIfError(assessmentsError, 'No se pudieron cargar tus evaluaciones.');

    const { data: periods, error: periodsError } = await client
        .from('academic_periods')
        .select('id, name, code, period_order, starts_on, ends_on, status')
        .eq('academic_year_id', (assignments || [])[0]?.academic_year_id || '')
        .order('period_order');
    throwIfError(periodsError, 'No se pudieron cargar los periodos académicos.');

    const { data: finalResults, error: finalResultsError } = await client
        .from('student_course_results')
        .select('id, course_assignment_id, academic_period_id, final_score, maximum_score, feedback, status, published_at')
        .eq('student_id', studentId)
        .eq('status', 'PUBLISHED');
    throwIfError(finalResultsError, 'No se pudieron cargar los resultados finales.');

    const { data: grades, error: gradesError } = await client
        .from('classroom_assessment_grades')
        .select('id, assessment_id, score, feedback, graded_at')
        .eq('student_id', studentId);
    throwIfError(gradesError, 'No se pudieron cargar tus calificaciones.');

    const weekdayNames = [
        { day: 'monday', label: 'Lunes' },
        { day: 'tuesday', label: 'Martes' },
        { day: 'wednesday', label: 'Miércoles' },
        { day: 'thursday', label: 'Jueves' },
        { day: 'friday', label: 'Viernes' },
        { day: 'saturday', label: 'Sábado' },
        { day: 'sunday', label: 'Domingo' },
    ];
    const assignmentById = new Map((assignments || []).map(item => [item.id, item]));
    const days = weekdayNames.map((day, index) => ({
        ...day,
        periods: (schedule || [])
            .filter(period => Number(period.weekday) === index + 1)
            .map(period => {
                const assignment = assignmentById.get(period.course_assignment_id);
                return {
                    start: String(period.start_time).slice(0, 5),
                    end: String(period.end_time).slice(0, 5),
                    subject: assignment?.subjects?.name || 'Clase',
                    classroom: period.classroom_label || null,
                    teacher: teacherNames.get(assignment?.teacher_membership_id) || null,
                };
            }),
    }));

    const gradeByAssessment = new Map((grades || []).map(item => [item.assessment_id, item]));
    const courses = (assignments || []).map(item => {
        const evaluations = (assessments || [])
            .filter(assessment => assessment.course_assignment_id === item.id)
            .map(assessment => {
                const grade = gradeByAssessment.get(assessment.id);
                return {
                    id: assessment.id,
                    name: assessment.title,
                    type: 'Evaluación',
                    date: assessment.assessment_date,
                    periodId: assessment.academic_period_id,
                    weight: Number(assessment.weight || 1),
                    grade: grade?.score ?? null,
                    maxScore: assessment.maximum_score,
                    feedback: grade?.feedback || null,
                };
            });
        const graded = evaluations.filter(item => item.grade !== null);
        const weighted = graded.reduce((acc, item) => { const weight = Number(item.weight || 1); acc.total += (Number(item.grade) / Number(item.maxScore || 20)) * 20 * weight; acc.weight += weight; return acc; }, { total: 0, weight: 0 });
        const currentAverage = weighted.weight ? weighted.total / weighted.weight : null;
        const publishedFinal = (finalResults || []).find(result => result.course_assignment_id === item.id && !result.academic_period_id) || null;
        return {
            id: item.id,
            code: item.subjects?.code || '',
            name: item.subjects?.name || 'Asignatura',
            description: item.subjects?.description || '',
            teacher: teacherNames.get(item.teacher_membership_id) || null,
            progress: {
                evaluations,
                currentAverage,
                finalGrade: publishedFinal?.final_score ?? null,
                finalized: Boolean(publishedFinal),
                finalFeedback: publishedFinal?.feedback || null,
                periods: (periods || []).map(period => ({ ...period, evaluations: evaluations.filter(e => e.periodId === period.id) })),
                maxScore: 20,
            },
        };
    });

    return {
        courses,
        schedule: { days, breaks: [], grade: null, section: null, academicYear: null },
        periods: periods || [],
        finalResults: finalResults || [],
        assessments: assessments || [],
        grades: grades || [],
    };
}

export async function getGuardianChildOverview(studentId, permissions = {}) {
    const client = requireClient();
    // Every query is additionally restricted by the guardian-specific RLS policies.
    const [studentResult, enrollmentResult, attendance, announcements] = await Promise.all([
        client.from('students')
            .select('id, institution_id, first_names, last_names, student_code, status')
            .eq('id', studentId)
            .maybeSingle(),
        client.from('enrollments')
            .select('id, classroom_id, academic_year_id, status, classrooms(id, level, grade_label, section_name), academic_years(name)')
            .eq('student_id', studentId)
            .eq('status', 'ACTIVE')
            .order('enrolled_at', { ascending: false }),
        permissions.attendance ? getStudentAttendance(studentId) : Promise.resolve([]),
        permissions.notifications ? getStudentAnnouncements(studentId) : Promise.resolve([]),
    ]);

    throwIfError(studentResult.error, 'No se pudo cargar la información del hijo.');
    throwIfError(enrollmentResult.error, 'No se pudo cargar la matrícula del hijo.');

    const enrollment = enrollmentResult.data?.[0] || null;
    const academic = enrollment?.classroom_id
        ? await getStudentAcademicData(studentId, enrollment.classroom_id)
        : { courses: [], schedule: [], assessments: [], grades: [] };

    return {
        student: studentResult.data,
        enrollment,
        attendance,
        announcements,
        academic: {
            ...academic,
            grades: permissions.grades ? academic.grades : [],
        },
    };
}
