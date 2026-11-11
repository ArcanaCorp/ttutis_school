
import { ScrollView, StyleSheet, View } from 'react-native';
import { IdCard, Sparkles } from 'lucide-react-native';

import Screen from '../../components/ui/Screen';
import TextApp from '../../components/ui/TextApp';
import Button from '../../components/ui/Button';
import Carousel from '../../components/ui/Carousel';
import Card from '../../components/notifications/Card';
import AttendanceWeek from '../../components/attendance/AttendanceWeek';

import { useAuth } from '../../context/AuthContext';
import { useStudentPortal } from '../../context/StudentPortalContext';
import { theme } from '../../constants/theme';

function Section({ title, subtitle, children }) {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionHeading}>
                    <TextApp size="lg" variant="semibold">
                        {title}
                    </TextApp>

                    {subtitle ? (
                        <TextApp
                            size="xs"
                            color={theme.colors.text.secondary}
                        >
                            {subtitle}
                        </TextApp>
                    ) : null}
                </View>
            </View>

            {children}
        </View>
    );
}

function HighlightCard({ item }) {
    return (
        <View style={styles.highlightCard}>
            <View style={styles.highlightIcon}>
                <Sparkles
                    size={20}
                    color={theme.colors.primary.foreground}
                    strokeWidth={1.8}
                />
            </View>

            <View style={styles.highlightContent}>
                <TextApp size="lg" variant="semibold">
                    {item.title}
                </TextApp>

                <TextApp
                    size="sm"
                    color={theme.colors.text.secondary}
                >
                    {item.description}
                </TextApp>
            </View>
        </View>
    );
}

function EmptyState({ message }) {
    return (
        <View style={styles.emptyState}>
            <TextApp
                size="sm"
                color={theme.colors.text.tertiary}
            >
                {message}
            </TextApp>
        </View>
    );
}

export default function HomeTab() {
    const { data, loading, error } = useStudentPortal();
    const { profile } = useAuth();

    const announcements = data?.announcements || [];
    const attendance = data?.attendance || [];
    const recommendations = [];
    const promotions = [];
    const studentName = data?.student
        ? `${data.student.first_names} ${data.student.last_names}`
        : profile?.fullName || 'Estudiante';

    return (
        <Screen>
            <View style={styles.header}>
                <View style={styles.greeting}>
                    <TextApp
                        size="2xl"
                        variant="bold"
                    >
                        Hola, {studentName.split(' ')[0]}
                    </TextApp>

                    <TextApp
                        size="sm"
                        color={theme.colors.text.secondary}
                    >
                        ¿Listo para aprender y divertirte?
                    </TextApp>
                </View>

                <Button
                    variant="ghost"
                    icon={IdCard}
                    iconSize={23}
                    iconStrokeWidth={1.7}
                    iconOnly
                    size="lg"
                />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {loading && <EmptyState message="Cargando tu información..." />}
                {!!error && <EmptyState message={error} />}
                <Section
                    title="Anuncios"
                    subtitle={data?.currentEnrollment?.classrooms ? `Avisos para ${data.currentEnrollment.classrooms.grade_label} ${data.currentEnrollment.classrooms.section_name} y para ti` : "Mantente al día con tu institución"}
                >
                    {announcements.length > 0 ? (
                        <Carousel
                            data={announcements}
                            cardWidth={320}
                            gap={theme.spacing[3]}
                            paddingHorizontal={theme.layout.screenPadding}
                            renderItem={({ item }) => (
                                <Card
                                    item={item}
                                    icon={false}
                                    lines={2}
                                />
                            )}
                        />
                    ) : (
                        <EmptyState message="No hay anuncios disponibles." />
                    )}
                </Section>

                <Section title="Tu asistencia" subtitle="Así va tu semana escolar">
                    <View>
                        <AttendanceWeek attendance={attendance} />
                    </View>
                </Section>

                <Section
                    title="Recomendaciones"
                    subtitle="Contenido para seguir aprendiendo"
                >
                    {recommendations.length > 0 ? (
                        <Carousel
                            data={recommendations}
                            cardWidth={260}
                            gap={theme.spacing[3]}
                            paddingHorizontal={theme.layout.screenPadding}
                            renderItem={({ item }) => (
                                <HighlightCard item={item} />
                            )}
                        />
                    ) : (
                        <EmptyState message="Próximamente tendrás recomendaciones." />
                    )}
                </Section>

                <Section
                    title="Promociones"
                    subtitle="Beneficios y novedades para ti"
                >
                    {promotions.length > 0 ? (
                        <Carousel
                            data={promotions}
                            cardWidth={260}
                            gap={theme.spacing[3]}
                            paddingHorizontal={theme.layout.screenPadding}
                            renderItem={({ item }) => (
                                <HighlightCard item={item} />
                            )}
                        />
                    ) : (
                        <EmptyState message="No hay promociones disponibles." />
                    )}
                </Section>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.layout.screenPadding,
        paddingVertical: theme.spacing[5],
        backgroundColor: theme.colors.background.DEFAULT,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.subtle,
    },

    greeting: {
        flex: 1,
        gap: theme.spacing[1],
    },

    content: {
        gap: theme.spacing[8],
    },

    section: {
        gap: theme.spacing[4],
    },

    sectionHeader: {
        paddingHorizontal: theme.layout.screenPadding,
    },

    sectionHeading: {
        gap: theme.spacing[1],
    },

    highlightCard: {
        minHeight: 168,
        padding: theme.spacing[5],
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.white,
        justifyContent: 'space-between',
        gap: theme.spacing[4],
        borderWidth: 1,
        borderColor: '#EEEEEE'
    },

    highlightIcon: {
        width: 40,
        height: 40,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.primary.DEFAULT,
        alignItems: 'center',
        justifyContent: 'center',
    },

    highlightContent: {
        gap: theme.spacing[2],
    },

    emptyState: {
        marginHorizontal: theme.layout.screenPadding,
        padding: theme.spacing[4],
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.background.subtle,
    },
});
