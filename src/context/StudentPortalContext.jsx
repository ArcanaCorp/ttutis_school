import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { getPortalIdentity, getStudentPortalContext, getStudentAnnouncements, getStudentAttendance, getStudentAcademicData, getGuardianChildren, getGuardianChildOverview, getStudentInstitutionalContent } from '../services/portalService';
const StudentPortalContext=createContext(null);
async function settle(promise,fallback){try{return await promise;}catch(error){console.warn('[PORTAL_SECTION]',error?.message||error);return fallback;}}
async function fetchPortal(selectedChildId=null){
 const identity=await getPortalIdentity();
 if(identity.roles.includes('STUDENT')){
  const context=await getStudentPortalContext(identity),studentId=context.student.id,classroomId=context.currentEnrollment?.classroom_id||null,institutionId=context.student.institution_id;
  const [announcements,attendance,academic,recommendations,promotions]=await Promise.all([
   settle(getStudentAnnouncements(studentId),[]),settle(getStudentAttendance(studentId),[]),
   settle(getStudentAcademicData(studentId,classroomId,context.currentEnrollment),{courses:[],schedule:{days:[],breaks:[]},assessments:[],grades:[],periods:[],finalResults:[]}),
   settle(getStudentInstitutionalContent(institutionId,classroomId,studentId,'RECOMMENDATION'),[]),
   settle(getStudentInstitutionalContent(institutionId,classroomId,studentId,'PROMOTION'),[])
  ]);
  return {...context,identity,portalRole:'STUDENT',announcements,attendance,academic,recommendations,promotions};
 }
 if(identity.roles.includes('GUARDIAN')){
  const children=await getGuardianChildren();
  const selectedChild=children.find(item=>item.student?.id===selectedChildId)||children[0]||null;
  const overview=selectedChild?await getGuardianChildOverview(selectedChild.student.id,selectedChild.permissions):null;
  return {identity,portalRole:'GUARDIAN',children,selectedChild,...(overview?{student:overview.student,currentEnrollment:overview.enrollment,academic:overview.academic,attendance:overview.attendance,announcements:overview.announcements}:{}),recommendations:[],promotions:[]};
 }
 throw new Error('Tu cuenta no tiene acceso al portal de alumnos o apoderados.');
}
export function StudentPortalProvider({children}){
 const {session}=useAuth(),userId=session?.user?.id;
 const [state,setState]=useState({userId:null,data:null,loading:false,error:null});
 const selectedChildId=state.userId===userId?state.data?.selectedChild?.student?.id:null;
 const refresh=useCallback(async()=>{if(!userId)return;setState(x=>({...x,userId,loading:true,error:null}));try{const data=await fetchPortal(selectedChildId);setState({userId,data,loading:false,error:null});}catch(error){setState({userId,data:null,loading:false,error:error?.message||'No se pudo cargar tu información.'});}},[userId,selectedChildId]);
 const selectChild=useCallback(async(childId)=>{if(!userId)return;setState(x=>({...x,userId,loading:true,error:null}));try{const data=await fetchPortal(childId);setState({userId,data,loading:false,error:null});}catch(error){setState({userId,data:null,loading:false,error:error?.message||'No se pudo cargar la información del alumno.'});}},[userId]);
 useEffect(()=>{if(!userId){setState({userId:null,data:null,loading:false,error:null});return undefined;}let active=true;fetchPortal().then(data=>{if(active)setState({userId,data,loading:false,error:null});}).catch(error=>{if(active)setState({userId,data:null,loading:false,error:error?.message||'No se pudo cargar tu información.'});});return()=>{active=false;};},[userId]);
 const current=state.userId===userId&&Boolean(userId);
 const value=useMemo(()=>({data:current?state.data:null,loading:Boolean(userId)&&(!current||state.loading),error:current?state.error:null,refresh,selectChild}),[current,state,userId,refresh,selectChild]);
 return <StudentPortalContext.Provider value={value}>{children}</StudentPortalContext.Provider>;
}
export function useStudentPortal(){const value=useContext(StudentPortalContext);if(!value)throw new Error('useStudentPortal debe utilizarse dentro de StudentPortalProvider.');return value;}
