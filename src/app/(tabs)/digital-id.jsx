import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react-native';
import Screen from '../../components/ui/Screen';
import TextApp from '../../components/ui/TextApp';
import Button from '../../components/ui/Button';
import { theme } from '../../constants/theme';
import { useStudentPortal } from '../../context/StudentPortalContext';
import { supabase } from '../../lib/supabase';
export default function DigitalId(){
 const router=useRouter(),{data}=useStudentPortal();const [token,setToken]=useState(''),[busy,setBusy]=useState(true);
 const issue=async()=>{setBusy(true);try{const {data:qr,error}=await supabase.rpc('issue_my_attendance_qr');if(error)throw error;if(!qr||typeof qr!=='string')throw new Error('No se pudo generar el código.');setToken(qr);}catch(error){Alert.alert('Carnet no disponible',error.message||'Inténtalo de nuevo.');}finally{setBusy(false);}};
 useEffect(()=>{issue();},[]);
 const student=data?.student,institution=data?.institution,room=data?.currentEnrollment?.classrooms;
 return <Screen><Stack.Screen options={{headerShown:false}}/><View style={styles.header}><Pressable onPress={()=>router.back()}><ArrowLeft color={theme.colors.text.primary}/></Pressable><View style={{flex:1}}><TextApp size="xl" variant="bold">Carnet digital</TextApp><TextApp size="xs" color={theme.colors.text.secondary}>Identificación y control de asistencia</TextApp></View><ShieldCheck color={theme.colors.state.success}/></View>
 <View style={styles.card}><View style={styles.brand}><TextApp size="xs" variant="bold" color={theme.colors.primary.DEFAULT}>{institution?.trade_name||institution?.legal_name||'TTUTIS'}</TextApp><TextApp size="xs" color={theme.colors.text.secondary}>CARNET ESTUDIANTIL</TextApp></View>
 <TextApp size="2xl" variant="bold" align="center">{student?.first_names} {student?.last_names}</TextApp>
 <TextApp size="sm" color={theme.colors.text.secondary} align="center">{room?.grade_label||'Grado'} · Sección {room?.section_name||'—'}</TextApp>
 <View style={styles.qr}>{token?<QRCode value={token} size={220} ecl="H"/>:<TextApp color={theme.colors.text.secondary}>{busy?'Generando código seguro...':'No se pudo generar el QR.'}</TextApp>}</View>
 <TextApp size="xs" color={theme.colors.text.secondary} align="center">Código de alumno: {student?.student_code||'—'}</TextApp>
 <TextApp size="xs" color={theme.colors.text.secondary} align="center">Este QR es dinámico. Actualízalo si se invalida o si el colegio lo solicita.</TextApp>
 <Button fullWidth loading={busy} onPress={issue} icon={RefreshCw}>Actualizar código QR</Button>
 </View></Screen>;
}
const styles=StyleSheet.create({header:{paddingHorizontal:22,paddingTop:20,flexDirection:'row',alignItems:'center',gap:14},card:{marginHorizontal:22,marginTop:24,padding:22,borderWidth:1,borderColor:theme.colors.border.subtle,borderRadius:22,backgroundColor:'#fff',gap:14,alignItems:'center'},brand:{width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingBottom:10,borderBottomWidth:1,borderBottomColor:theme.colors.border.subtle},qr:{padding:14,borderRadius:18,backgroundColor:'#fff',borderWidth:1,borderColor:theme.colors.border.subtle,minHeight:248,minWidth:248,alignItems:'center',justifyContent:'center'}});
