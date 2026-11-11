import { Tabs, Redirect } from 'expo-router';
import { House, CalendarDays, BookOpen, Bell, UserRound, ClipboardCheck } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function TabsLayout() {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!session) return <Redirect href="/login" />;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary.DEFAULT,
                tabBarInactiveTintColor: theme.colors.text.tertiary,
                tabBarStyle: {
                    height: 72,
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border.subtle,
                    elevation: 0,
                },
                tabBarLabelStyle: {
                    fontFamily: theme.typography.fontFamily.medium,
                    fontSize: 11,
                    marginTop: 4,
                },
                tabBarIconStyle: { marginTop: 2 },
            }}
        >
            <Tabs.Screen name="digital-id" options={{ href: null }} />
            <Tabs.Screen name="home" options={{
                title: 'Inicio',
                tabBarIcon: ({ color, size, focused }) => <House size={size} color={color} strokeWidth={focused ? 2 : 1.5} />,
            }} />
            <Tabs.Screen name="schedule" options={{
                title: 'Horario',
                tabBarIcon: ({ color, size, focused }) => <CalendarDays size={size} color={color} strokeWidth={focused ? 2 : 1.5} />,
            }} />
            <Tabs.Screen name="attendance" options={{ title: 'Asistencia', tabBarIcon: ({ color, size, focused }) => <ClipboardCheck size={size} color={color} strokeWidth={focused ? 2 : 1.5} /> }} />
            <Tabs.Screen name="courses" options={{
                title: 'Cursos',
                tabBarIcon: ({ color, size, focused }) => <BookOpen size={size} color={color} strokeWidth={focused ? 2 : 1.5} />,
            }} />
            <Tabs.Screen name="notifications" options={{
                title: 'Avisos',
                tabBarIcon: ({ color, size, focused }) => <Bell size={size} color={color} strokeWidth={focused ? 2 : 1.5} />,
            }} />
            <Tabs.Screen name="profile" options={{
                title: 'Perfil',
                tabBarIcon: ({ color, size, focused }) => <UserRound size={size} color={color} strokeWidth={focused ? 2 : 1.5} />,
            }} />
        </Tabs>
    );
}
