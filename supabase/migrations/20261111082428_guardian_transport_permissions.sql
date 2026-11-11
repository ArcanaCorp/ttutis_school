alter table public.guardian_student_links add column if not exists can_view_transport boolean not null default false;
create or replace function private.guardian_can_view(p_student_id uuid,p_permission text)
returns boolean language sql stable security definer set search_path=''
as $$
 select exists(select 1 from public.guardian_student_links gl where gl.student_id=p_student_id and gl.guardian_profile_id=(select auth.uid()) and gl.status='ACTIVE' and case p_permission when 'ATTENDANCE' then gl.can_view_attendance when 'GRADES' then gl.can_view_grades when 'BEHAVIOR' then gl.can_view_behavior when 'FEES' then gl.can_view_fees when 'NOTIFICATIONS' then gl.can_receive_notifications when 'TRANSPORT' then gl.can_view_transport else false end)
$$;
drop policy if exists student_transport_details_read on public.student_transport_details;
create policy student_transport_details_read on public.student_transport_details for select to authenticated using(private.is_institution_admin(institution_id) or private.has_institution_role(institution_id,array['ASSISTANT']::text[]) or exists(select 1 from public.students s join public.memberships m on m.id=s.membership_id where s.id=student_id and m.profile_id=(select auth.uid()) and m.role='STUDENT' and m.status='ACTIVE') or private.guardian_can_view(student_id,'TRANSPORT'));
