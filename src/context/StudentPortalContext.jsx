import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import {
    getStudentPortalContext,
    getStudentAnnouncements,
    getStudentAttendance,
    getStudentAcademicData,
} from '../services/portalService';

const StudentPortalContext = createContext(null);

async function fetchStudentPortal() {
    const context = await getStudentPortalContext();
    const studentId = context.student.id;
    const classroomId = context.currentEnrollment?.classroom_id || null;
    const [announcements, attendance, academic] = await Promise.all([
        getStudentAnnouncements(studentId),
        getStudentAttendance(studentId),
        getStudentAcademicData(studentId, classroomId),
    ]);

    return { ...context, announcements, attendance, academic };
}

export function StudentPortalProvider({ children }) {
    const { session } = useAuth();
    const userId = session?.user?.id;
    const [portalState, setPortalState] = useState({
        userId: null,
        data: null,
        loading: false,
        error: null,
    });

    const refresh = useCallback(async () => {
        if (!userId) return;

        setPortalState((current) => ({
            ...current,
            userId,
            loading: true,
            error: null,
        }));

        try {
            const data = await fetchStudentPortal();
            setPortalState({ userId, data, loading: false, error: null });
        } catch (loadError) {
            setPortalState({
                userId,
                data: null,
                loading: false,
                error: loadError?.message || 'No se pudo cargar tu información.',
            });
        }
    }, [userId]);

    useEffect(() => {
        if (!userId) return undefined;

        let active = true;
        const load = async () => {
            try {
                const data = await fetchStudentPortal();
                if (active) setPortalState({ userId, data, loading: false, error: null });
            } catch (loadError) {
                if (active) {
                    setPortalState({
                        userId,
                        data: null,
                        loading: false,
                        error: loadError?.message || 'No se pudo cargar tu información.',
                    });
                }
            }
        };

        load();
        return () => {
            active = false;
        };
    }, [userId]);

    // A state snapshot is only visible to the account that loaded it. This
    // prevents a previous user's data from flashing after sign-out/account swap.
    const isCurrentUser = portalState.userId === userId && Boolean(userId);
    const data = isCurrentUser ? portalState.data : null;
    const loading = Boolean(userId) && (!isCurrentUser || portalState.loading);
    const error = isCurrentUser ? portalState.error : null;

    const value = useMemo(() => ({ data, loading, error, refresh }), [data, loading, error, refresh]);

    return <StudentPortalContext.Provider value={value}>{children}</StudentPortalContext.Provider>;
}

export function useStudentPortal() {
    const value = useContext(StudentPortalContext);
    if (!value) throw new Error('useStudentPortal debe utilizarse dentro de StudentPortalProvider.');
    return value;
}
