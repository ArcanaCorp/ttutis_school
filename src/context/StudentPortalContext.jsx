import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import {
    getStudentPortalContext,
    getStudentAnnouncements,
    getStudentAttendance,
    getStudentAcademicData,
} from '../services/portalService';

const StudentPortalContext = createContext(null);

export function StudentPortalProvider({ children }) {
    const { session } = useAuth();
    const userId = session?.user?.id;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        if (!userId) {
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const context = await getStudentPortalContext();
            const studentId = context.student.id;
            const classroomId = context.currentEnrollment?.classroom_id || null;
            const [announcements, attendance, academic] = await Promise.all([
                getStudentAnnouncements(studentId),
                getStudentAttendance(studentId),
                getStudentAcademicData(studentId, classroomId),
            ]);
            setData({ ...context, announcements, attendance, academic });
        } catch (loadError) {
            setData(null);
            setError(loadError?.message || 'No se pudo cargar tu información.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Load on authentication changes. State updates happen after asynchronous
    // work, not synchronously in the effect body.
    useEffect(() => {
        if (!userId) {
            setData(null);
            setError(null);
            return undefined;
        }

        let active = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const context = await getStudentPortalContext();
                const studentId = context.student.id;
                const classroomId = context.currentEnrollment?.classroom_id || null;
                const [announcements, attendance, academic] = await Promise.all([
                    getStudentAnnouncements(studentId),
                    getStudentAttendance(studentId),
                    getStudentAcademicData(studentId, classroomId),
                ]);
                if (active) setData({ ...context, announcements, attendance, academic });
            } catch (loadError) {
                if (active) {
                    setData(null);
                    setError(loadError?.message || 'No se pudo cargar tu información.');
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, [userId]);

    const value = useMemo(() => ({ data, loading, error, refresh }), [data, loading, error, refresh]);

    return <StudentPortalContext.Provider value={value}>{children}</StudentPortalContext.Provider>;
}

export function useStudentPortal() {
    const value = useContext(StudentPortalContext);
    if (!value) throw new Error('useStudentPortal debe utilizarse dentro de StudentPortalProvider.');
    return value;
}
