
import { useState } from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    ScrollView,
} from 'react-native';

import {
    BookOpen,
    GraduationCap,
    UserRound,
    MapPin,
    Clock3,
    CalendarDays,
    Award,
    ClipboardList,
    FileText,
    CheckCircle2,
    Info,
} from 'lucide-react-native';

import Screen from '../../components/ui/Screen';
import TextApp from '../../components/ui/TextApp';
import Carousel from '../../components/ui/Carousel';

import { theme } from '../../constants/theme';
import { studentPortal } from '../../db/db';

const TABS = [
    { id: 'progress', label: 'Progreso', icon: Award },
    { id: 'information', label: 'Información', icon: Info },
];

function formatGrade(value) {
    if (value === null || value === undefined) return '--';
    return Number(value).toFixed(1);
}

function ProgressBar({ value, max = 20, color }) {
    const percentage = Math.min(
        Math.max((Number(value) / max) * 100, 0),
        100
    );

    return (
        <View style={styles.progressTrack}>
            <View
                style={[
                    styles.progressFill,
                    {
                        width: `${percentage}%`,
                        backgroundColor: color || theme.colors.primary[500],
                    },
                ]}
            />
        </View>
    );
}

function CourseCard({ item, selected, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.courseCard,
                selected && styles.selectedCourse,
            ]}
        >
            <View style={styles.courseCardTop}>
                <View style={styles.courseIcon}>
                    <BookOpen
                        size={23}
                        color={theme.colors.primary.foreground}
                    />
                </View>

                {selected && (
                    <CheckCircle2
                        size={21}
                        color={theme.colors.primary.foreground}
                    />
                )}
            </View>

            <View style={styles.courseCardContent}>
                <TextApp
                    size="lg"
                    variant="bold"
                    color={theme.colors.primary.foreground}
                    numberOfLines={1}
                >
                    {item.name}
                </TextApp>

                <TextApp
                    size="xs"
                    color={theme.colors.primary.foreground}
                    numberOfLines={2}
                >
                    {item.description || 'Asignatura académica'}
                </TextApp>
            </View>

            <View style={styles.courseCardFooter}>
                <TextApp
                    size="xs"
                    variant="medium"
                    color={theme.colors.primary.foreground}
                >
                    {item.code || 'CURSO'}
                </TextApp>

                <TextApp
                    size="xs"
                    color={theme.colors.primary.foreground}
                >
                    {selected ? 'Seleccionado' : 'Ver curso'}
                </TextApp>
            </View>
        </Pressable>
    );
}

function EvaluationItem({ item }) {
    const grade = Number(item.grade);
    const maxScore = Number(item.maxScore) || 20;
    const hasGrade = item.grade !== null && item.grade !== undefined;

    const percentage = hasGrade ? (grade / maxScore) * 100 : 0;

    const statusColor = !hasGrade
        ? theme.colors.neutral[400]
        : percentage >= 70
            ? theme.colors.state.success
            : percentage >= 50
                ? theme.colors.state.warning
                : theme.colors.state.error;

    const Icon = item.type === 'exam'
        ? FileText
        : ClipboardList;

    return (
        <View style={styles.evaluation}>
            <View style={styles.evaluationIcon}>
                <Icon
                    size={19}
                    color={theme.colors.text.secondary}
                />
            </View>

            <View style={styles.evaluationInfo}>
                <TextApp size="sm" variant="semibold">
                    {item.name}
                </TextApp>

                <TextApp
                    size="xs"
                    color={theme.colors.text.secondary}
                >
                    {item.type === 'exam'
                        ? 'Examen'
                        : item.type === 'test'
                            ? 'Test'
                            : item.type === 'task'
                                ? 'Tarea'
                                : item.type || 'Evaluación'}
                    {item.date ? ` · ${item.date}` : ''}
                </TextApp>

                <ProgressBar
                    value={grade}
                    max={maxScore}
                    color={statusColor}
                />
            </View>

            <View style={styles.gradeContainer}>
                <TextApp
                    size="md"
                    variant="bold"
                    color={hasGrade ? statusColor : theme.colors.text.tertiary}
                >
                    {hasGrade ? formatGrade(grade) : '--'}
                </TextApp>

                <TextApp
                    size="xs"
                    color={theme.colors.text.tertiary}
                >
                    / {maxScore}
                </TextApp>
            </View>
        </View>
    );
}

function ProgressContent({ subject }) {
    const progress = subject.progress || {};
    const evaluations = progress.evaluations || [];

    const finalGrade = progress.finalGrade;
    const currentAverage = progress.currentAverage;

    const hasFinalGrade = finalGrade !== null && finalGrade !== undefined;
    const hasAverage = currentAverage !== null && currentAverage !== undefined;

    return (
        <View style={styles.content}>
            <View style={styles.sectionHeading}>
                <View>
                    <TextApp size="lg" variant="bold">
                        Rendimiento académico
                    </TextApp>

                    <TextApp
                        size="xs"
                        color={theme.colors.text.secondary}
                    >
                        Consulta tus resultados y evaluaciones.
                    </TextApp>
                </View>
            </View>

            <View style={styles.gradesGrid}>
                <View style={styles.mainGrade}>
                    <View style={styles.gradeHeading}>
                        <Award
                            size={20}
                            color={theme.colors.primary.foreground}
                        />
                        <TextApp
                            size="sm"
                            variant="medium"
                            color={theme.colors.primary.foreground}
                        >
                            Calificación final
                        </TextApp>
                    </View>

                    <TextApp
                        size="4xl"
                        variant="bold"
                        color={theme.colors.primary.foreground}
                    >
                        {hasFinalGrade ? formatGrade(finalGrade) : '--'}
                    </TextApp>

                    <TextApp
                        size="xs"
                        color={theme.colors.primary.foreground}
                    >
                        {progress.finalized
                            ? 'Nota final registrada'
                            : 'Calificación pendiente'}
                    </TextApp>
                </View>

                <View style={styles.averageCard}>
                    <TextApp
                        size="xs"
                        color={theme.colors.text.secondary}
                    >
                        Promedio actual
                    </TextApp>

                    <TextApp size="2xl" variant="bold">
                        {hasAverage ? formatGrade(currentAverage) : '--'}
                    </TextApp>

                    <TextApp
                        size="xs"
                        color={theme.colors.text.tertiary}
                    >
                        Sobre {progress.maxScore || 20}
                    </TextApp>
                </View>
            </View>

            <View style={styles.evaluationsSection}>
                <View style={styles.sectionTitleRow}>
                    <TextApp size="md" variant="semibold">
                        Evaluaciones
                    </TextApp>

                    <View style={styles.countBadge}>
                        <TextApp size="xs" variant="semibold">
                            {evaluations.length}
                        </TextApp>
                    </View>
                </View>

                {evaluations.length > 0 ? (
                    <View style={styles.evaluationsList}>
                        {evaluations.map((item, index) => (
                            <EvaluationItem
                                key={item.id || `${item.name}-${index}`}
                                item={item}
                            />
                        ))}
                    </View>
                ) : (
                    <View style={styles.empty}>
                        <ClipboardList
                            size={28}
                            color={theme.colors.text.tertiary}
                        />
                        <TextApp
                            size="sm"
                            color={theme.colors.text.secondary}
                        >
                            Todavía no hay evaluaciones registradas.
                        </TextApp>
                    </View>
                )}
            </View>
        </View>
    );
}

function InformationItem({ icon: Icon, label, value }) {
    if (!value) return null;

    return (
        <View style={styles.informationItem}>
            <View style={styles.informationIcon}>
                <Icon
                    size={20}
                    color={theme.colors.text.secondary}
                />
            </View>

            <View style={styles.informationText}>
                <TextApp
                    size="xs"
                    color={theme.colors.text.tertiary}
                >
                    {label}
                </TextApp>

                <TextApp size="sm" variant="semibold">
                    {value}
                </TextApp>
            </View>
        </View>
    );
}

function InformationContent({ subject }) {
    return (
        <View style={styles.content}>
            <View style={styles.sectionHeading}>
                <View>
                    <TextApp size="lg" variant="bold">
                        Información del curso
                    </TextApp>

                    <TextApp
                        size="xs"
                        color={theme.colors.text.secondary}
                    >
                        Conoce los detalles de tu asignatura.
                    </TextApp>
                </View>
            </View>

            <View style={styles.informationCard}>
                <View style={styles.informationHero}>
                    <View style={styles.informationHeroIcon}>
                        <BookOpen
                            size={26}
                            color={theme.colors.primary.foreground}
                        />
                    </View>

                    <View style={{ flex: 1, gap: 3 }}>
                        <TextApp size="lg" variant="bold">
                            {subject.name}
                        </TextApp>

                        <TextApp
                            size="xs"
                            color={theme.colors.text.secondary}
                        >
                            {subject.code || 'Asignatura'}
                        </TextApp>
                    </View>
                </View>

                {subject.description && (
                    <TextApp
                        size="sm"
                        color={theme.colors.text.secondary}
                    >
                        {subject.description}
                    </TextApp>
                )}

                <View style={styles.informationDivider} />

                <View style={styles.informationList}>
                    <InformationItem
                        icon={UserRound}
                        label="Profesor"
                        value={subject.teacher}
                    />

                    <InformationItem
                        icon={MapPin}
                        label="Aula"
                        value={subject.classroom}
                    />

                    <InformationItem
                        icon={Clock3}
                        label="Duración"
                        value={subject.duration}
                    />

                    <InformationItem
                        icon={CalendarDays}
                        label="Horario"
                        value={subject.schedule}
                    />

                    <InformationItem
                        icon={GraduationCap}
                        label="Área académica"
                        value={subject.area}
                    />
                </View>
            </View>
        </View>
    );
}

export default function CoursesTab() {
    const { subjects = [] } = studentPortal;

    const [selectedId, setSelectedId] = useState(
        subjects[0]?.id ?? subjects[0]?.code ?? subjects[0]?.name ?? null
    );

    const [activeTab, setActiveTab] = useState('progress');

    const selectedSubject = subjects.find(
        subject =>
            (subject.id ?? subject.code ?? subject.name) === selectedId
    ) || subjects[0];

    function selectSubject(subject) {
        setSelectedId(
            subject.id ?? subject.code ?? subject.name
        );
        setActiveTab('progress');
    }

    return (
        <Screen>
            <View style={styles.header}>
                <View>
                    <TextApp size="2xl" variant="bold">
                        Cursos
                    </TextApp>

                    <TextApp
                        size="xs"
                        color={theme.colors.text.secondary}
                    >
                        Descubre todo lo que aprenderás este año.
                    </TextApp>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.main}
            >
                <View style={styles.coursesSection}>
                    <View style={styles.sectionHeader}>
                        <TextApp size="lg" variant="semibold">
                            Mis asignaturas
                        </TextApp>

                        <TextApp
                            size="xs"
                            color={theme.colors.text.secondary}
                        >
                            {subjects.length} cursos
                        </TextApp>
                    </View>

                    <Carousel
                        data={subjects}
                        cardWidth={250}
                        gap={12}
                        paddingHorizontal={theme.spacing[5]}
                        keyExtractor={(item) =>
                            String(item.id ?? item.code ?? item.name)
                        }
                        renderItem={({ item }) => (
                            <CourseCard
                                item={item}
                                selected={
                                    (item.id ?? item.code ?? item.name) === selectedId
                                }
                                onPress={() => selectSubject(item)}
                            />
                        )}
                    />
                </View>

                {selectedSubject && (
                    <View style={styles.detailsSection}>
                        <View style={styles.selectedHeading}>
                            <View>
                                <TextApp
                                    size="xs"
                                    color={theme.colors.text.secondary}
                                >
                                    CURSO SELECCIONADO
                                </TextApp>

                                <TextApp size="xl" variant="bold">
                                    {selectedSubject.name}
                                </TextApp>
                            </View>
                        </View>

                        <View style={styles.tabs}>
                            {TABS.map(tab => {
                                const Icon = tab.icon;
                                const active = activeTab === tab.id;

                                return (
                                    <Pressable
                                        key={tab.id}
                                        onPress={() => setActiveTab(tab.id)}
                                        style={[
                                            styles.tab,
                                            active && styles.activeTab,
                                        ]}
                                    >
                                        <Icon
                                            size={18}
                                            color={active
                                                ? theme.colors.primary.foreground
                                                : theme.colors.text.secondary}
                                        />

                                        <TextApp
                                            size="sm"
                                            variant={active ? 'semibold' : 'medium'}
                                            color={active
                                                ? theme.colors.primary.foreground
                                                : theme.colors.text.secondary}
                                        >
                                            {tab.label}
                                        </TextApp>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {activeTab === 'progress' ? (
                            <ProgressContent subject={selectedSubject} />
                        ) : (
                            <InformationContent subject={selectedSubject} />
                        )}
                    </View>
                )}

                {subjects.length === 0 && (
                    <View style={styles.empty}>
                        <BookOpen
                            size={32}
                            color={theme.colors.text.tertiary}
                        />

                        <TextApp
                            size="sm"
                            color={theme.colors.text.secondary}
                        >
                            No tienes cursos registrados.
                        </TextApp>
                    </View>
                )}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing[6],
        paddingHorizontal: theme.layout.screenPadding,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.subtle,
        backgroundColor: theme.colors.background.DEFAULT,
    },

    main: {
        paddingBottom: theme.spacing[8],
        gap: theme.spacing[6],
    },

    coursesSection: {
        gap: theme.spacing[3],
    },

    sectionHeader: {
        paddingHorizontal: theme.spacing[5],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    courseCard: {
        flex: 1,
        minHeight: 175,
        padding: theme.spacing[4],
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.primary[200],
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: 'transparent',
    },

    selectedCourse: {
        backgroundColor: theme.colors.primary[400],
        borderColor: theme.colors.primary[700],
    },

    courseCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    courseIcon: {
        width: 42,
        height: 42,
        borderRadius: theme.radius.md,
        backgroundColor: 'rgba(255,255,255,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    courseCardContent: {
        gap: theme.spacing[1],
    },

    courseCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing[2],
        borderTopWidth: 1,
        borderTopColor: 'rgba(67,31,5,0.15)',
    },

    detailsSection: {
        paddingHorizontal: theme.spacing[5],
        gap: theme.spacing[4],
    },

    selectedHeading: {
        gap: theme.spacing[1],
    },

    tabs: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.background.subtle,
        gap: 4,
    },

    tab: {
        flex: 1,
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing[2],
        borderRadius: theme.radius.md,
    },

    activeTab: {
        backgroundColor: theme.colors.primary.DEFAULT,
    },

    content: {
        gap: theme.spacing[4],
    },

    sectionHeading: {
        gap: 3,
    },

    gradesGrid: {
        flexDirection: 'row',
        gap: theme.spacing[3],
    },

    mainGrade: {
        flex: 1.2,
        minHeight: 155,
        padding: theme.spacing[4],
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.primary[400],
        justifyContent: 'space-between',
    },

    gradeHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[2],
    },

    averageCard: {
        flex: 1,
        minHeight: 155,
        padding: theme.spacing[4],
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.background.subtle,
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
        justifyContent: 'center',
        gap: theme.spacing[2],
    },

    evaluationsSection: {
        gap: theme.spacing[3],
    },

    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[2],
    },

    countBadge: {
        minWidth: 24,
        height: 24,
        borderRadius: theme.radius.full,
        backgroundColor: theme.colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
    },

    evaluationsList: {
        gap: theme.spacing[3],
    },

    evaluation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[3],
        padding: theme.spacing[3],
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
        backgroundColor: theme.colors.surface.DEFAULT,
    },

    evaluationIcon: {
        width: 40,
        height: 40,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.background.subtle,
        alignItems: 'center',
        justifyContent: 'center',
    },

    evaluationInfo: {
        flex: 1,
        gap: theme.spacing[1],
    },

    gradeContainer: {
        alignItems: 'center',
    },

    progressTrack: {
        height: 5,
        width: '100%',
        overflow: 'hidden',
        borderRadius: theme.radius.full,
        backgroundColor: theme.colors.neutral[200],
    },

    progressFill: {
        height: '100%',
        borderRadius: theme.radius.full,
    },

    informationCard: {
        padding: theme.spacing[4],
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.surface.DEFAULT,
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
        gap: theme.spacing[4],
    },

    informationHero: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[3],
    },

    informationHeroIcon: {
        width: 48,
        height: 48,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
    },

    informationDivider: {
        height: 1,
        backgroundColor: theme.colors.border.subtle,
    },

    informationList: {
        gap: theme.spacing[4],
    },

    informationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[3],
    },

    informationIcon: {
        width: 38,
        height: 38,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.background.subtle,
        alignItems: 'center',
        justifyContent: 'center',
    },

    informationText: {
        flex: 1,
        gap: 3,
    },

    empty: {
        padding: theme.spacing[8],
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing[3],
    },
});
