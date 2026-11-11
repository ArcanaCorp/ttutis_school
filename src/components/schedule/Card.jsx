import { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { BookOpen, Coffee, Utensils, GraduationCap, Clock3, ChevronDown, CalendarDays } from 'lucide-react-native';
import TextApp from '../ui/TextApp';
import { theme } from '../../constants/theme';

// Día de la semana actual
const DAY_KEYS = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
];

const ACTIVITY_CONFIG = {
    recess: {
        title: 'Recreo',
        subtitle: 'Tiempo de descanso',
        icon: Coffee,
        color: '#B7791F',
        background: '#FFF8E8',
        border: '#F5E8C9',
    },

    lunch: {
        title: 'Almuerzo',
        subtitle: 'Hora de alimentación',
        icon: Utensils,
        color: '#27845B',
        background: '#EDF8F1',
        border: '#D6EDDF',
    },

    tutoring: {
        title: 'Tutoría',
        subtitle: 'Acompañamiento académico',
        icon: GraduationCap,
        color: '#5275B8',
        background: '#EFF4FD',
        border: '#DCE6F7',
    },
};

function getCurrentDay() {
    return DAY_KEYS[new Date().getDay()];
}

function getDuration(start, end) {
    if (!start || !end) return 0;

    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    return (endHour * 60 + endMinute) -
        (startHour * 60 + startMinute);
}

function formatDuration(minutes) {
    if (minutes <= 0) return '';

    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (hours && remaining) return `${hours} h ${remaining} min`;
    if (hours) return `${hours} h`;

    return `${minutes} min`;
}

function PeriodItem({ period, index, breaks = [] }) {
    const isActivity = !!period.type;

    const breakInfo = breaks.find(
        item => item.type === period.type
    );

    const config = isActivity
        ? {
            ...ACTIVITY_CONFIG[period.type],
            title: breakInfo?.title ||
                ACTIVITY_CONFIG[period.type]?.title ||
                period.type,
        }
        : null;

    const Icon = config?.icon || BookOpen;

    const duration = getDuration(period.start, period.end);

    return (
        <View style={styles.periodRow}>
            <View style={styles.timeline}>
                <View
                    style={[
                        styles.timelineDot,
                        {
                            backgroundColor: config
                                ? config.color
                                : theme.colors.primary[500],
                        },
                    ]}
                />

                <View style={styles.timelineLine} />
            </View>

            <View
                style={[
                    styles.periodCard,
                    config && {
                        backgroundColor: config.background,
                        borderColor: config.background,
                    },
                ]}
            >
                <View style={styles.periodTop}>
                    <View style={styles.periodInfo}>
                        <View
                            style={[
                                styles.periodIcon,
                                {
                                    backgroundColor: config
                                        ? config.color + '20'
                                        : theme.colors.primary[100],
                                },
                            ]}
                        >
                            <Icon
                                size={18}
                                color={config
                                    ? config.color
                                    : theme.colors.primary[700]}
                                strokeWidth={1.8}
                            />
                        </View>

                        <View style={styles.periodText}>
                            <TextApp
                                size="xs"
                                color={theme.colors.text.tertiary}
                                variant="medium"
                            >
                                {isActivity
                                    ? 'ACTIVIDAD'
                                    : `CLASE ${String(index + 1).padStart(2, '0')}`}
                            </TextApp>

                            <TextApp
                                size="md"
                                variant="semibold"
                                color={theme.colors.text.primary}
                            >
                                {config?.title || period.subject}
                            </TextApp>

                            {config?.subtitle && (
                                <TextApp
                                    size="xs"
                                    color={theme.colors.text.secondary}
                                >
                                    {config.subtitle}
                                </TextApp>
                            )}
                        </View>
                    </View>

                    <View style={styles.timeContainer}>
                        <TextApp
                            size="sm"
                            variant="semibold"
                            color={theme.colors.text.primary}
                        >
                            {period.start}
                        </TextApp>

                        <TextApp
                            size="xs"
                            color={theme.colors.text.tertiary}
                        >
                            {period.end}
                        </TextApp>
                    </View>
                </View>

                <View style={styles.periodFooter}>
                    <View style={styles.detail}>
                        <Clock3
                            size={13}
                            color={theme.colors.text.secondary}
                        />
                        <TextApp
                            size="xs"
                            color={theme.colors.text.secondary}
                        >
                            {formatDuration(duration)}
                        </TextApp>
                    </View>

                    {!isActivity && (
                        <TextApp
                            size="xs"
                            variant="medium"
                            color={theme.colors.text.secondary}
                        >
                            {period.subject}
                        </TextApp>
                    )}
                </View>
            </View>
        </View>
    );
}

function DayAccordion({ day, schedule, expanded, isToday, onPress }) {
    const periods = day.periods || [];

    const totalMinutes = periods.reduce(
        (total, period) => total + getDuration(period.start, period.end),
        0
    );

    const classCount = periods.filter(
        period => !!period.subject
    ).length;

    return (
        <View style={styles.dayContainer}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.dayHeader,
                    pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
            >
                <View style={styles.dayIcon}>
                    <CalendarDays
                        size={21}
                        color={theme.colors.primary.foreground}
                    />
                </View>

                <View style={styles.dayInfo}>
                    <View style={styles.dayTitleRow}>
                        <TextApp
                            size="lg"
                            variant="bold"
                            color={theme.colors.primary.foreground}
                        >
                            {day.label}
                        </TextApp>

                        {isToday && (
                            <View style={styles.todayBadge}>
                                <TextApp
                                    size="xs"
                                    variant="semibold"
                                    color={theme.colors.primary.foreground}
                                >
                                    HOY
                                </TextApp>
                            </View>
                        )}
                    </View>

                    <TextApp
                        size="xs"
                        color={theme.colors.primary.foreground}
                    >
                        {classCount} clases · {periods.length} períodos
                    </TextApp>
                </View>

                <View style={styles.headerRight}>
                    <TextApp
                        size="xs"
                        variant="medium"
                        color={theme.colors.primary.foreground}
                    >
                        {formatDuration(totalMinutes)}
                    </TextApp>

                    <ChevronDown
                        size={21}
                        color={theme.colors.primary.foreground}
                        style={{
                            transform: [
                                { rotate: expanded ? '180deg' : '0deg' },
                            ],
                        }}
                    />
                </View>
            </Pressable>

            {expanded && (
                <View style={styles.dayContent}>
                    {periods.length > 0 ? (
                        periods.map((period, index) => (
                            <PeriodItem
                                key={`${day.day}-${period.start}-${index}`}
                                period={period}
                                index={index}
                                breaks={schedule.breaks || []}
                            />
                        ))
                    ) : (
                        <View style={styles.empty}>
                            <CalendarDays
                                size={28}
                                color={theme.colors.text.tertiary}
                            />

                            <TextApp
                                size="sm"
                                color={theme.colors.text.secondary}
                            >
                                No hay períodos programados.
                            </TextApp>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

export default function Card({ schedule }) {
    const currentDay = getCurrentDay();

    const [expandedDay, setExpandedDay] = useState(currentDay);

    const days = schedule?.days || [];

    function toggleDay(day) {
        setExpandedDay(current =>
            current === day ? null : day
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.scheduleInfo}>
                <View style={styles.scheduleIcon}>
                    <GraduationCap
                        size={20}
                        color={theme.colors.text.secondary}
                    />
                </View>

                <View style={styles.scheduleText}>
                    <TextApp
                        size="sm"
                        variant="semibold"
                    >
                        {`Grado ${schedule?.grade || '-'} · Sección ${schedule?.section || '-'}`}
                    </TextApp>

                    <TextApp
                        size="xs"
                        color={theme.colors.text.secondary}
                    >
                        Año académico {schedule?.academicYear || '-'}
                    </TextApp>
                </View>
            </View>

            <View style={styles.days}>
                {days.map(day => (
                    <DayAccordion
                        key={day.day}
                        day={day}
                        schedule={schedule}
                        expanded={expandedDay === day.day}
                        isToday={currentDay === day.day}
                        onPress={() => toggleDay(day.day)}
                    />
                ))}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        gap: theme.spacing[3],
    },

    scheduleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[3],
        paddingHorizontal: theme.spacing[2],
    },

    scheduleIcon: {
        width: 40,
        height: 40,
        borderRadius: theme.radius.md,
        backgroundColor: '#F4F4F2',
        alignItems: 'center',
        justifyContent: 'center',
    },

    scheduleText: {
        gap: 2,
    },

    days: {
        gap: theme.spacing[3],
    },

    dayContainer: {
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
        backgroundColor: theme.colors.surface.DEFAULT,
    },

    dayHeader: {
        minHeight: 76,
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing[3],
        gap: theme.spacing[3],
        backgroundColor: theme.colors.primary[100],
    },

    pressed: {
        opacity: 0.75,
    },

    dayIcon: {
        width: 42,
        height: 42,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.primary[200],
        alignItems: 'center',
        justifyContent: 'center',
    },

    dayInfo: {
        flex: 1,
        gap: 3,
    },

    dayTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[2],
    },

    todayBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: theme.radius.full,
        backgroundColor: theme.colors.primary[400],
    },

    headerRight: {
        alignItems: 'flex-end',
        gap: 5,
    },

    dayContent: {
        padding: theme.spacing[3],
        gap: theme.spacing[2],
        backgroundColor: theme.colors.surface.DEFAULT,
    },

    periodRow: {
        flexDirection: 'row',
        gap: theme.spacing[2],
    },

    timeline: {
        width: 12,
        alignItems: 'center',
    },

    timelineDot: {
        width: 9,
        height: 9,
        borderRadius: theme.radius.full,
        marginTop: theme.spacing[4],
    },

    timelineLine: {
        width: 1,
        flex: 1,
        backgroundColor: theme.colors.border.DEFAULT,
        marginTop: 4,
    },

    periodCard: {
        flex: 1,
        padding: theme.spacing[3],
        borderRadius: theme.radius.lg,
        backgroundColor: '#FAFAF9',
        borderWidth: 1,
        borderColor: theme.colors.border.subtle,
        gap: theme.spacing[3],
    },

    periodTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: theme.spacing[2],
    },

    periodInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[2],
    },

    periodIcon: {
        width: 36,
        height: 36,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },

    periodText: {
        flex: 1,
        gap: 2,
    },

    timeContainer: {
        alignItems: 'flex-end',
        gap: 2,
    },

    periodFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },

    empty: {
        padding: theme.spacing[6],
        alignItems: 'center',
        gap: theme.spacing[2],
    },
});