import { Image, StyleSheet, View } from 'react-native';

import TextApp from '../../components/ui/TextApp';
import Screen from '../../components/ui/Screen';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Divider from '../../components/ui/Divider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {

    const router = useRouter();
    const { signIn, isConfigured } = useAuth();
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await signIn(code, password);
            router.replace('/(tabs)/home');
        } catch (signInError) {
            setError(signInError.message || 'No se pudo iniciar sesión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Screen>
            <View style={styles.logoWrap}>
                <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
            </View>

            <View style={styles.content}>
                <View style={styles.heading}>
                    <TextApp variant="bold" size="2xl">Bienvenido</TextApp>
                    <TextApp color="#767676" size="sm">Ingresa tus datos de alumno para continuar.</TextApp>
                </View>

                <Divider />

                <View style={styles.form}>
                    <Input label="Código de acceso" placeholder="A12345678" required size="lg" value={code} onChangeText={setCode} autoCapitalize="characters" />
                    <Input label="Contraseña" type="password" placeholder="Ingresa tu contraseña" required size="lg" value={password} onChangeText={setPassword} onSubmitEditing={handleSignIn} returnKeyType="go" />
                    {!isConfigured && <TextApp size="xs" color="#b42318">Falta configurar la conexión con TTUTIS en .env.local.</TextApp>}
                    {!!error && <TextApp size="xs" color="#b42318" accessibilityRole="alert">{error}</TextApp>}
                    <Button fullWidth size="lg" loading={loading} disabled={!isConfigured || !code.trim() || !password || loading} onPress={handleSignIn}>Ingresar</Button>
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    logoWrap: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },

    logo: {
        height: 180,
        aspectRatio: 1/1,
        resizeMode: 'contain'
    },

    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },

    heading: {
        gap: 6,
        marginBottom: 12,
    },

    form: {
        gap: 18,
    },
});
