import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import Screen from "../../components/ui/Screen";
import TextApp from "../../components/ui/TextApp";
import { theme } from "../../constants/theme";
import Card from "../../components/notifications/Card";
import { useStudentPortal } from "../../context/StudentPortalContext";

export default function NotificationsTab() {
    const { data, loading, error, refresh } = useStudentPortal();
    const announcements = data?.announcements || [];

    return (
        <Screen>
            <View style={styles.header}>
                <View>
                    <TextApp size="2xl" variant="bold">Avisos</TextApp>
                    <TextApp size="xs" color="#767676">Anuncios de tu institución, aula y dirigidos a ti.</TextApp>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.main} showsVerticalScrollIndicator={false}>
                {loading && <ActivityIndicator color={theme.colors.primary.DEFAULT} />}
                {!!error && <TextApp size="sm" color={theme.colors.state.error}>{error}</TextApp>}
                {!loading && !error && announcements.length === 0 && (
                    <TextApp size="sm" color={theme.colors.text.secondary}>No tienes avisos disponibles por el momento.</TextApp>
                )}
                {announcements.map(item => <Card key={item.id} item={item} />)}
            </ScrollView>
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
    main: { gap: 12, paddingHorizontal: 24, paddingVertical: 16 },
});
