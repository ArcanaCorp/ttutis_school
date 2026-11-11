import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { getPortalIdentity, getStudentPortalContext, getStudentAnnouncements, getStudentAttendance, getStudentAcademicData, getGuardianChildren } from '../services/portalService';
const StudentPortalContext = createContext(null);
async function settle(promise, fallback) { try { return await promise; } catch (error) { console.warn('[PORTAL_SECTION]', error?.message || error); return fallback; } }
async function fetchPortal() {
 const identity = await getPortalIdentity();
 if (identity.roles.includes('STUDENT')) {
  const context = await getStudentPortalContext(identity), studentId=context.student.id, classroomId=context.currentEnrollment?.classroom_id || null;
  const [announcements,attendance,academic]=await Promise.all([
   settle(getStudentAnnouncements(studentId),[]),settle(getStudentAttendance(studentId),[]),
   settle(getStudentAcademicData(studentId,classroomId,context.currentEnrollment),{courses:[],schedule:{days:[],breaks:[]},assessments:[],grades:[],periods:[],finalResults:[]})
  ]);
  return {...context,identity,portalRole:'STUDENT',announcements,attendance,academic};
 }
 if (identity.roles.includes('GUARDIAN')) return {identity,portalRole:'GUARDIAN',children:await getGuardianChildren()};
 throw new Error('Tu cuenta no tiene acceso al portal de alumnos o apoderados.');
}
export function StudentPortalProvider({children}) {
 const {session}=useAuth(), userId=session?.user?.id;
 const [state,setState]=useState({userId:null,data:null,loading:false,error:null});
 const refresh=useCallback(async()=>{if(!userId)return;setState(x=>({...x,userId,loading:true,error:null}));try{const data=await fetchPortal();setState({userId,data,loading:false,error:null});}catch(error){setState({userId,data:null,loading:false,error:error?.message||'No se pudo cargar tu información.'});}},[userId]);
 useEffect(()=>{if(!userId){setState({userId:null,data:null,loading:false,error:null});return undefined;}let active=true;fetchPortal().then(data=>{if(active)setState({userId,data,loading:false,error:null});}).catch(error=>{if(active)setState({userId,data:null,loading:false,error:error?.message||'No se pudo cargar tu información.'});});return()=>{active=false;};},[userId]);
 const current=state.userId===userId&&Boolean(userId);
 const value=useMemo(()=>({data:current?state.data:null,loading:Boolean(userId)&&(!current||state.loading),error:current?state.error:null,refresh}),[current,state,userId,refresh]);
 return <StudentPortalContext.Provider value={value}>{children}</StudentPortalContext.Provider>;
}
export function useStudentPortal(){const value=useContext(StudentPortalContext);if(!value)throw new Error('useStudentPortal debe utilizarse dentro de StudentPortalProvider.');return value;}
