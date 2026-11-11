import { StyleSheet, View } from "react-native";
import Screen from "../../components/ui/Screen";
import TextApp from "../../components/ui/TextApp";
import { theme } from "../../constants/theme";
import { studentPortal } from "../../db/db";
import Card from "../../components/schedule/Card";

export default function ScheduleTab () {

    const { schedule } = studentPortal;

    return (
        <Screen>
            <View style={styles.header}>
                <View>
                    <TextApp size="2xl" variant="bold">Horario</TextApp>
                    <TextApp size="xs" color="#767676">Organiza tu día y prepárate para cada clase.</TextApp>
                </View>
            </View>
            <View style={styles.main}>
                <Card schedule={schedule} />
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        borderBottomWidth: .5,
        borderBottomColor: '#CCCCCC',
        backgroundColor: theme.colors.background.DEFAULT,
    },
    main: {
        gap: 12,
        paddingHorizontal: 24,
    },
})