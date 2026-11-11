import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Screen from '../../components/ui/Screen';
import TextApp from '../../components/ui/TextApp';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { theme } from '../../constants/theme';
export default function GuardianRegister(){
 const router=useRouter();const [name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[claim,setClaim]=useState(''),[busy,setBusy]=useState(false);
 const submit=async()=>{if(name.trim().length<2||!email.includes('@')||password.length<8||!claim.trim()){Alert.alert('Revisa tus datos','Completa nombre, correo, contraseña (mínimo 8 caracteres) y código de vinculación.');return;}setBusy(true);try{
  const {data,error}=await supabase.auth.signUp({email:email.trim().toLowerCase(),password,options:{data:{full_name:name.trim()}}});if(error)throw error;
  if(!data.session){Alert.alert('Verifica tu correo','Tu cuenta se creó. Confirma el correo desde el mensaje recibido y luego inicia sesión para ingresar el código de vinculación.');router.replace('/login');return;}
  const {error:claimError}=await supabase.rpc('claim_student_as_guardian',{p_token:claim.trim().toLowerCase()});if(claimError)throw claimError;
  Alert.alert('Cuenta vinculada','Tu cuenta de apoderado quedó vinculada al alumno.');router.replace('/(tabs)/home');
 }catch(error){Alert.alert('No se pudo completar el registro',error.message||'Verifica el código con el colegio.');}finally{setBusy(false);}};
 return <Screen><View style={styles.wrap}><TextApp size="2xl" variant="bold">Registro de apoderado</TextApp><TextApp color={theme.colors.text.secondary}>Crea tu cuenta y vincúlala con el código de un solo uso entregado por el colegio.</TextApp><Input label="Nombre completo" value={name} onChangeText={setName} placeholder="Tu nombre" autoCapitalize="words"/><Input label="Correo electrónico" value={email} onChangeText={setEmail} placeholder="correo@ejemplo.com" keyboardType="email-address" autoCapitalize="none"/><Input label="Contraseña" type="password" value={password} onChangeText={setPassword} placeholder="Mínimo 8 caracteres"/><Input label="Código de vinculación" value={claim} onChangeText={setClaim} placeholder="Código proporcionado por el colegio" autoCapitalize="none"/><Button fullWidth loading={busy} onPress={submit}>Crear cuenta y vincular</Button><Link href="/login" style={styles.link}>Ya tengo una cuenta</Link></View></Screen>;
}
const styles=StyleSheet.create({wrap:{padding:24,gap:16},link:{color:theme.colors.primary.DEFAULT,textAlign:'center',padding:12}});
