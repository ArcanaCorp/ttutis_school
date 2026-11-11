import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import Screen from "../../components/ui/Screen";
import TextApp from "../../components/ui/TextApp";
import { theme } from "../../constants/theme";
import Card from "../../components/notifications/Card";
import { useStudentPortal } from "../../context/StudentPortalContext";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function NotificationsTab() {
    const { data, loading, error } = useStudentPortal();
    const router = useRouter();
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
                {announcements.map(item => <Pressable key={item.id} onPress={() => router.push({ pathname: '/notifications/[id]', params: { id: item.id } })}><Card item={item} /><TextApp size="xs" color={item.isRead ? theme.colors.text.tertiary : theme.colors.primary.DEFAULT}>{item.isRead ? 'Leído' : 'No leído · Ver detalle'}</TextApp></Pressable>)}
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
