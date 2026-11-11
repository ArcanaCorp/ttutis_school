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
    return (data || []).filter(item => !studentId || !item.student_id || item.student_id === studentId);
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
    return data || [];
}

export async function getStudentAcademicData(studentId, classroomId) {
    const client = requireClient();
    if (!classroomId) return { courses: [], schedule: [], assessments: [], grades: [] };

    const { data: assignments, error: assignmentsError } = await client
        .from('course_assignments')
        .select('id, subject_id, teacher_membership_id, subjects(id, code, name, description), memberships!course_assignments_teacher_membership_id_fkey(full_name)')
        .eq('classroom_id', classroomId)
        .eq('status', 'ACTIVE');
    throwIfError(assignmentsError, 'No se pudieron cargar tus cursos.');

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
        .select('id, course_assignment_id, title, description, assessment_date, maximum_score, status')
        .eq('classroom_id', classroomId)
        .in('status', ['PUBLISHED', 'ACTIVE'])
        .order('assessment_date', { ascending: false });
    throwIfError(assessmentsError, 'No se pudieron cargar tus evaluaciones.');

    const { data: grades, error: gradesError } = await client
        .from('classroom_assessment_grades')
        .select('id, assessment_id, score, feedback, graded_at')
        .eq('student_id', studentId);
    throwIfError(gradesError, 'No se pudieron cargar tus calificaciones.');

    return {
        courses: (assignments || []).map(item => ({
            id: item.id,
            subject: item.subjects,
            teacher: item.memberships?.full_name || null,
        })),
        schedule: schedule || [],
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
