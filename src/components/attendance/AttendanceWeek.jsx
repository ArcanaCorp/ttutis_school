
import { View, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import TextApp from '../ui/TextApp';

const WEEKDAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE'];

const STATUS_CONFIG = {
    punctual: {
        label: 'Puntual',
        color: theme.colors.state.success,
        background: theme.colors.stateBackground.success,
    },
    late: {
        label: 'Tarde',
        color: theme.colors.state.warning,
        background: theme.colors.stateBackground.warning,
    },
    absent: {
        label: 'Falta',
        color: theme.colors.state.error,
        background: theme.colors.stateBackground.error,
    },
    unknown: {
        label: 'Sin registro',
        color: theme.colors.neutral[400],
        background: theme.colors.white,
    },
};

function getLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function getCurrentWeek() {
    const today = new Date();
    const monday = new Date(today);

    const day = today.getDay();
    const difference = day === 0 ? -6 : 1 - day;

    monday.setDate(today.getDate() + difference);
    monday.setHours(0, 0, 0, 0);

    return WEEKDAYS.map((weekday, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);

        return {
            weekday,
            date,
            dateKey: getLocalDateKey(date),
            isToday: getLocalDateKey(date) === getLocalDateKey(today),
        };
    });
}

export default function AttendanceWeek({ attendance = [] }) {
    const week = getCurrentWeek();

    const attendanceMap = Object.fromEntries(
        attendance.map(record => [
            record.date,
            record.status,
        ])
    );

    return (
        <View style={styles.container}>

            <View style={styles.days}>
                {week.map(item => {
                    const status = attendanceMap[item.dateKey] || 'unknown';
                    const config = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;

                    return (
                        <View key={item.dateKey} style={[styles.day, {backgroundColor: config.background, borderColor: item.isToday ? config.color : theme.colors.border.subtle}, item.isToday && styles.selectedDay]}>
                            <TextApp size="xs" variant="medium" align='center' color={theme.colors.text.secondary}>{config.label}</TextApp>
                            <TextApp size="xl" variant="bold" color={theme.colors.text.primary}>{String(item.date.getDate()).padStart(2, '0')}</TextApp>
                            <TextApp size="xs" variant="medium" color={theme.colors.text.secondary}> {item.weekday}</TextApp>
                        </View>
                    );
                })}
            </View>

            <View style={styles.legend}>
                {Object.entries(STATUS_CONFIG)
                    .filter(([key]) => key !== 'unknown')
                    .map(([key, config]) => (
                        <View key={key} style={styles.legendItem}>
                            <View
                                style={[
                                    styles.legendDot,
                                    { backgroundColor: config.color },
                                ]}
                            />
                            <TextApp
                                size="xs"
                                color={theme.colors.text.secondary}
                            >
                                {config.label}
                            </TextApp>
                        </View>
                    ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: theme.spacing[6],
        gap: 6
    },

    days: {
        flexDirection: 'row',
        gap: 6,
    },

    day: {
        flex: 1,
        minWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 6,
        borderWidth: 1,
        borderRadius: theme.radius.md,
    },

    selectedDay: {
        borderWidth: 1.5,
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: theme.radius.full,
    },

    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 16,
    },

    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    legendDot: {
        width: 7,
        height: 7,
        borderRadius: theme.radius.full,
    },
});
