import { Alert, Image, StyleSheet, View } from "react-native";
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ChevronRight, UserRound, GraduationCap, Settings2, CircleHelp, FileText, ShieldCheck, Bell, Users, Building2, Bus, LogOut } from "lucide-react-native";

import Screen from "../../components/ui/Screen";
import TextApp from "../../components/ui/TextApp";
import { theme } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../components/ui/Avatar";
import Divider from "../../components/ui/Divider";
import Button from "../../components/ui/Button";

const profileSections = [
    {
        title: "Mi información",
        items: [
            {
                label: "Datos personales",
                description: "Tu información y datos de contacto",
                icon: UserRound,
                route: "/profile/personal",
            },
            {
                label: "Padres y tutores",
                description: "Personas responsables de ti",
                icon: Users,
                route: "/profile/guardians",
            },
        ],
    },
    {
        title: "Mi institución",
        items: [
            {
                label: "Información académica",
                description: "Grado, sección y año escolar",
                icon: GraduationCap,
                route: "/profile/academic",
            },
            {
                label: "Mi colegio",
                description: "Información de tu institución",
                icon: Building2,
                route: "/profile/school",
            },
            {
                label: "Transporte y salida",
                description: "Cómo llegas y sales del colegio",
                icon: Bus,
                route: "/profile/transportation",
            },
        ],
    },
    {
        title: "Preferencias",
        items: [
            {
                label: "Notificaciones",
                description: "Gestiona tus avisos y recordatorios",
                icon: Bell,
                route: "/profile/notifications",
            },
            {
                label: "Configuración",
                description: "Personaliza tu experiencia",
                icon: Settings2,
                route: "/profile/settings",
            },
        ],
    },
    {
        title: "Ayuda y legal",
        items: [
            {
                label: "Centro de ayuda",
                description: "Resuelve tus dudas sobre TTUTIS",
                icon: CircleHelp,
                route: "/help",
            },
            {
                label: "Términos y condiciones",
                icon: FileText,
                route: "/legal/terms",
            },
            {
                label: "Política de privacidad",
                icon: ShieldCheck,
                route: "/legal/privacy",
            },
        ],
    },
];

function ProfileSection({ title, items }) {
    return (
        <View style={styles.section}>
            <TextApp size="sm" variant="semibold" style={styles.sectionTitle}>{title}</TextApp>

            {items.map((item, index) => {
                const Icon = item.icon;

                return (
                    <View key={item.route}>
                        {index > 0 && <Divider />}

                        <View style={styles.item}>
                            <View style={styles.itemIcon}>
                                <Icon size={20} color={theme.colors.text.secondary} />
                            </View>
                            <View style={styles.itemContent}>
                                <TextApp variant="medium">{item.label}</TextApp>
                                {item.description && (
                                    <TextApp size="xs" color={theme.colors.text.secondary}>{item.description}</TextApp>
                                )}
                            </View>

                            <ChevronRight size={20} color={theme.colors.text.secondary} />
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

export default function ProfileTab() {
    const { profile, signOut } = useAuth();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const academic = profile?.academic;

    const educationLevel = {
        primary: "Primaria",
        secondary: "Secundaria",
        initial: "Inicial",
    }[academic?.educationLevel] ?? academic?.educationLevel;

    const handleSignOut = async () => {
        setLoggingOut(true);
        try {
            await signOut();
            router.replace('/login');
        } catch (error) {
            Alert.alert('No se pudo cerrar sesión', error.message);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <Screen>
            
            <View style={styles.banner}>
                <View style={styles.avatar}>
                    <Avatar name={profile?.fullName || "Estudiante"} size={100}/>
                </View>
                <Image source={require("../../../assets/images/doodle.png")} style={styles.bannerImage} />
            </View>

            <View style={styles.main}>
                
                <View style={styles.profileInfo}>
                    <TextApp size="2xl" variant="semibold">{profile?.fullName}</TextApp>
                    <TextApp size="sm" color={theme.colors.text.secondary}>{academic?.school?.name}</TextApp>
                    <View style={styles.academicBadge}>
                        <TextApp size="xs" variant="medium">{educationLevel} · {academic?.grade}° {academic?.section}</TextApp>
                        <TextApp size="xs" color={theme.colors.text.secondary}>Año escolar {academic?.academicYear}</TextApp>
                    </View>
                </View>

                {profileSections.map((section) => (
                    <ProfileSection key={section.title} title={section.title} items={section.items}/>
                ))}

                <Button variant="dangerSoft" fullWidth rounded="full" icon={LogOut} loading={loggingOut} onPress={handleSignOut}>Cerrar sesión</Button>

                <TextApp size="xs" color={theme.colors.text.secondary} style={styles.version}>TTUTIS · Versión 1.0.0</TextApp>
            </View>

        </Screen>
    );
}

const styles = StyleSheet.create({
    banner: {
        position: "relative",
        height: 120,
        marginBottom: 40,
        backgroundColor: "#EEEEEE",
    },
    bannerImage: {
        height: 120,
        aspectRatio: 16 / 4,
        resizeMode: "contain",
    },
    avatar: {
        position: "absolute",
        left: 10,
        bottom: -60,
        width: 120,
        height: 120,
        zIndex: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.full,
        backgroundColor: theme.colors.background.DEFAULT,
    },
    main: {
        gap: 20,
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    profileInfo: {
        gap: 4,
    },
    academicBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 8,
    },
    section: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.background.DEFAULT,
    },
    sectionTitle: {
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        gap: 12,
    },
    itemIcon: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.md,
        backgroundColor: "#F5F5F5",
    },
    itemContent: {
        flex: 1,
        gap: 2,
    },
    version: {
        textAlign: "center",
        marginTop: -8,
    },
});
