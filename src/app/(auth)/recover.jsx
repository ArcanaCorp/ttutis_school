import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import Screen from '../../components/ui/Screen';
import TextApp from '../../components/ui/TextApp';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { theme } from '../../constants/theme';
export default function RecoverPassword(){
 const [email,setEmail]=useState(''),[busy,setBusy]=useState(false);
 const submit=async()=>{if(!email.includes('@')){Alert.alert('Correo no válido','Ingresa el correo asociado a tu cuenta.');return;}setBusy(true);try{const {error}=await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(),{redirectTo:'ttutis://update-password'});if(error)throw error;Alert.alert('Solicitud enviada','Si el correo corresponde a una cuenta, recibirás instrucciones para restablecer tu contraseña.');}catch(error){Alert.alert('No se pudo enviar la solicitud',error.message);}finally{setBusy(false);}};
 return <Screen><View style={styles.wrap}><TextApp size="2xl" variant="bold">Recuperar contraseña</TextApp><TextApp color={theme.colors.text.secondary}>Te enviaremos un enlace al correo asociado a tu cuenta.</TextApp><Input label="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="correo@ejemplo.com"/><Button fullWidth loading={busy} onPress={submit}>Enviar instrucciones</Button><Link href="/login" style={styles.link}>Volver al inicio de sesión</Link></View></Screen>;
}
const styles=StyleSheet.create({wrap:{padding:24,gap:16},link:{color:theme.colors.primary.DEFAULT,textAlign:'center',padding:12}});
