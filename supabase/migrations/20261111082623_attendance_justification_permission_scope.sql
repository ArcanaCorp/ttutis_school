drop policy if exists attendance_justifications_read_related on public.attendance_justifications;
create policy attendance_justifications_read_related on public.attendance_justifications for select to authenticated using(
 private.is_institution_admin(institution_id)
 or private.has_institution_role(institution_id,array['ASSISTANT']::text[])
 or exists(select 1 from public.students s join public.memberships m on m.id=s.membership_id where s.id=student_id and m.profile_id=(select auth.uid()) and m.role='STUDENT' and m.status='ACTIVE')
 or private.guardian_can_view(student_id,'ATTENDANCE')
);