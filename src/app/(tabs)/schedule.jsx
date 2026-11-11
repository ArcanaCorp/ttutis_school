import { ActivityIndicator, StyleSheet, View } from "react-native";
import Screen from "../../components/ui/Screen";
import TextApp from "../../components/ui/TextApp";
import { theme } from "../../constants/theme";
import Card from "../../components/schedule/Card";
import { useStudentPortal } from "../../context/StudentPortalContext";

export default function ScheduleTab() {
    const { data, loading, error } = useStudentPortal();
    const schedule = data?.academic?.schedule;

    return (
        <Screen>
            <View style={styles.header}>
                <View>
                    <TextApp size="2xl" variant="bold">Horario</TextApp>
                    <TextApp size="xs" color="#767676">Horario correspondiente a tu matrícula activa.</TextApp>
                </View>
            </View>
            <View style={styles.main}>
                {loading && <ActivityIndicator color={theme.colors.primary.DEFAULT} />}
                {!!error && <TextApp size="sm" color={theme.colors.state.error}>{error}</TextApp>}
                {!loading && !error && schedule && <Card schedule={schedule} />}
                {!loading && !error && !schedule && <TextApp size="sm" color={theme.colors.text.secondary}>No hay un horario publicado para tu salón.</TextApp>}
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#CCCCCC',
        backgroundColor: theme.colors.background.DEFAULT,
    },
    main: { gap: 12, paddingHorizontal: 24, paddingTop: 16 },
});
