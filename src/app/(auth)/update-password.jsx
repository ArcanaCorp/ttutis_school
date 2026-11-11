import { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Screen from '../../components/ui/Screen';
import TextApp from '../../components/ui/TextApp';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { theme } from '../../constants/theme';
function tokensFromUrl(url){const fragment=url.split('#')[1]||'',query=url.split('?')[1]?.split('#')[0]||'',params=new URLSearchParams(query);const hash=new URLSearchParams(fragment);return {access_token:params.get('access_token')||hash.get('access_token'),refresh_token:params.get('refresh_token')||hash.get('refresh_token'),type:params.get('type')||hash.get('type')};}
export default function UpdatePassword(){
 const router=useRouter();const [password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[ready,setReady]=useState(false),[busy,setBusy]=useState(false);
 useEffect(()=>{let active=true;const accept=async(url)=>{if(!url)return;const t=tokensFromUrl(url);if(t.access_token&&t.refresh_token){const {error}=await supabase.auth.setSession({access_token:t.access_token,refresh_token:t.refresh_token});if(error)Alert.alert('Enlace no válido',error.message);else if(active)setReady(true);}};Linking.getInitialURL().then(accept);const sub=Linking.addEventListener('url',e=>accept(e.url));supabase.auth.getSession().then(({data})=>{if(active&&data.session)setReady(true);});return()=>{active=false;sub.remove();};},[]);
 const submit=async()=>{if(password.length<8||password!==confirm){Alert.alert('Revisa la contraseña','Debe tener al menos 8 caracteres y coincidir en ambos campos.');return;}setBusy(true);try{const {error}=await supabase.auth.updateUser({password});if(error)throw error;Alert.alert('Contraseña actualizada','Ya puedes ingresar con tu nueva contraseña.');router.replace('/login');}catch(error){Alert.alert('No se pudo actualizar',error.message);}finally{setBusy(false);}};
 return <Screen><View style={styles.wrap}><TextApp size="2xl" variant="bold">Nueva contraseña</TextApp><TextApp color={theme.colors.text.secondary}>{ready?'Define una contraseña nueva para tu cuenta.':'Abre esta pantalla desde el enlace de recuperación que enviamos a tu correo.'}</TextApp><Input label="Nueva contraseña" type="password" value={password} onChangeText={setPassword} placeholder="Mínimo 8 caracteres"/><Input label="Confirmar contraseña" type="password" value={confirm} onChangeText={setConfirm} placeholder="Repite tu contraseña"/><Button fullWidth disabled={!ready} loading={busy} onPress={submit}>Guardar contraseña</Button><Link href="/login" style={styles.link}>Volver al acceso</Link></View></Screen>;
}
const styles=StyleSheet.create({wrap:{padding:24,gap:16},link:{color:theme.colors.primary.DEFAULT,textAlign:'center',padding:12}});
