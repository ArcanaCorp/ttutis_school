import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Download, Paperclip } from 'lucide-react-native';
import Screen from '../../../components/ui/Screen';
import TextApp from '../../../components/ui/TextApp';
import Button from '../../../components/ui/Button';
import { theme } from '../../../constants/theme';
import { useStudentPortal } from '../../../context/StudentPortalContext';
import { markStudentUpdateRead } from '../../../services/portalService';
import { supabase } from '../../../lib/supabase';
export default function NotificationDetail(){
 const {id}=useLocalSearchParams(),router=useRouter(),{data,refresh}=useStudentPortal();
 const item=data?.announcements?.find(x=>x.id===id);const [urls,setUrls]=useState({});
 useEffect(()=>{if(!id)return;markStudentUpdateRead(String(id)).then(()=>refresh()).catch(e=>console.warn('read receipt',e.message));},[id]);
 useEffect(()=>{let active=true;(async()=>{if(!item?.attachments?.length)return;const entries=await Promise.all(item.attachments.map(async a=>{const {data,error}=await supabase.storage.from('student-update-attachments').createSignedUrl(a.storage_path,300);return [a.id,error?null:data?.signedUrl];}));if(active)setUrls(Object.fromEntries(entries));})();return()=>{active=false;};},[item?.id]);
 return <Screen><Stack.Screen options={{headerShown:false}}/><View style={styles.header}><Pressable onPress={()=>router.back()}><ArrowLeft color={theme.colors.text.primary}/></Pressable><TextApp size="xl" variant="bold">Detalle del comunicado</TextApp></View>
 {!item?<TextApp color={theme.colors.text.secondary}>No encontramos este comunicado en tu bandeja actual.</TextApp>:<View style={styles.card}><TextApp size="xs" color={theme.colors.text.secondary}>{item.type} · {new Date(item.date||item.created_at).toLocaleDateString('es-PE')}</TextApp><TextApp size="xl" variant="bold">{item.title}</TextApp><TextApp>{item.message}</TextApp><View style={styles.read}><TextApp size="xs" color={theme.colors.state.success}>Marcado como leído</TextApp></View>
 {item.attachments?.length? <View style={styles.attachments}><TextApp variant="semibold">Archivos adjuntos</TextApp>{item.attachments.map(a=><View key={a.id} style={styles.file}><Paperclip size={18} color={theme.colors.text.secondary}/><TextApp style={{flex:1}}>{a.file_name}</TextApp><Button size="sm" disabled={!urls[a.id]} onPress={()=>urls[a.id]&&require('expo-linking').openURL(urls[a.id])}>Abrir</Button></View>)}</View>:null}</View>}
 </Screen>;
}
const styles=StyleSheet.create({header:{paddingHorizontal:22,paddingTop:20,flexDirection:'row',alignItems:'center',gap:16},card:{marginHorizontal:22,padding:18,borderWidth:1,borderColor:theme.colors.border.subtle,borderRadius:16,gap:14},read:{alignSelf:'flex-start',paddingHorizontal:10,paddingVertical:5,backgroundColor:'#EAF8EF',borderRadius:20},attachments:{gap:10},file:{flexDirection:'row',alignItems:'center',gap:8,paddingVertical:8,borderTopWidth:1,borderTopColor:theme.colors.border.subtle}});
