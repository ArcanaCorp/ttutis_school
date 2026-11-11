import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Screen from '../../components/ui/Screen';
import TextApp from '../../components/ui/TextApp';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { theme } from '../../constants/theme';
export default function GuardianClaim(){
 const router=useRouter();const [token,setToken]=useState(''),[busy,setBusy]=useState(false);
 const submit=async()=>{setBusy(true);try{const {data:auth}=await supabase.auth.getUser();if(!auth?.user)throw new Error('Primero inicia sesión con tu correo de apoderado.');const {error}=await supabase.rpc('claim_student_as_guardian',{p_token:token.trim().toLowerCase()});if(error)throw error;Alert.alert('Vínculo confirmado','Ya puedes consultar la información autorizada del alumno.');router.replace('/(tabs)/home');}catch(error){Alert.alert('No se pudo vincular',error.message||'Verifica el código con el colegio.');}finally{setBusy(false);}};
 return <Screen><View style={styles.wrap}><TextApp size="2xl" variant="bold">Vincular a mi hijo</TextApp><TextApp color={theme.colors.text.secondary}>Inicia sesión con tu cuenta de apoderado y escribe el código temporal que te entregó el colegio.</TextApp><Input label="Código de vinculación" value={token} onChangeText={setToken} autoCapitalize="none" placeholder="Código de 48 caracteres"/><Button fullWidth loading={busy} disabled={token.trim().length!==48} onPress={submit}>Verificar y vincular</Button><Link href="/login" style={styles.link}>Volver al acceso</Link></View></Screen>;
}
const styles=StyleSheet.create({wrap:{padding:24,gap:16},link:{color:theme.colors.primary.DEFAULT,textAlign:'center',padding:12}});
