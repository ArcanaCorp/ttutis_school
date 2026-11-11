import { StyleSheet, View } from "react-native";
import { AlertCircle, AlertTriangle, Info } from "lucide-react-native";
import TextApp from "../ui/TextApp";
import { theme } from "../../constants/theme";

const priorityConfig = {
    high: {
        icon: AlertCircle,
        color: theme.colors.state.error,
        background: theme.colors.stateBackground.error,
        label: "Urgente",
    },
    medium: {
        icon: AlertTriangle,
        color: theme.colors.state.warning,
        background: theme.colors.stateBackground.warning,
        label: "Importante",
    },
    low: {
        icon: Info,
        color: theme.colors.state.info,
        background: theme.colors.stateBackground.info,
        label: "Informativo",
    },
};

export default function Card({ item, minWidth, icon=true, lines }) {

    const config = priorityConfig[item.priority] || priorityConfig.low;
    const Icon = config.icon;

    return (
        <View style={[styles.card, { minWidth: minWidth }]}>
            {icon && (
                <View style={[styles.icon, { backgroundColor: config.background }]}>
                    <Icon size={24} color={config.color} strokeWidth={1.5} />
                </View>
            )}

            <View style={styles.content}>
                <View style={styles.header}>
                    <TextApp size="xs" color={theme.colors.text.secondary}>{item.type}</TextApp>
                    <TextApp size="xs" variant="semibold" color={config.color}>{config.label}</TextApp>
                </View>

                <TextApp size="xl" variant="semibold">{item.title}</TextApp>
                <TextApp size="md" style={styles.message} numberOfLines={lines}>{item.message}</TextApp>

                <TextApp size="xs" color={theme.colors.text.secondary} numberOfLines={2}>{[item.location, item.time, item.date].filter(Boolean).join(" • ")}</TextApp>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        gap: 12,
        borderRadius: 20,
        padding: 14,
        borderWidth: 0.5,
        borderColor: theme.colors.border.DEFAULT,
        backgroundColor: theme.colors.background.DEFAULT,
    },

    icon: {
        width: 46,
        height: 46,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },

    content: {
        flex: 1,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5,
    },

    message: {
        marginVertical: 12,
    },
});