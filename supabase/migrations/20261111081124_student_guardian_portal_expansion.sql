-- Student + guardian portal expansion. Mirrors Supabase migration 20261111081124.
create table if not exists public.academic_periods(id uuid primary key default gen_random_uuid(),institution_id uuid not null references public.institutions(id) on delete cascade,academic_year_id uuid not null references public.academic_years(id) on delete cascade,name text not null,code text,period_order int not null,starts_on date not null,ends_on date not null,status text not null default 'PLANNED' check(status in('PLANNED','ACTIVE','CLOSED')),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),check(ends_on>=starts_on),unique(academic_year_id,code),unique(academic_year_id,period_order));
alter table public.classroom_assessments add column if not exists academic_period_id uuid references public.academic_periods(id) on delete set null;
alter table public.classroom_assessments add column if not exists weight numeric(8,3) not null default 1 check(weight>0);
alter table public.institutions add column if not exists grading_settings jsonb not null default '{"scale":20,"method":"WEIGHTED","default_assessment_weight":1}'::jsonb;
create table if not exists public.student_course_results(id uuid primary key default gen_random_uuid(),institution_id uuid not null references public.institutions(id) on delete cascade,student_id uuid not null references public.students(id) on delete cascade,course_assignment_id uuid not null references public.course_assignments(id) on delete cascade,academic_year_id uuid not null references public.academic_years(id) on delete cascade,academic_period_id uuid references public.academic_periods(id) on delete set null,final_score numeric(8,2),maximum_score numeric(8,2) not null default 20,feedback text,status text not null default 'DRAFT' check(status in('DRAFT','PUBLISHED','CLOSED')),published_at timestamptz,published_by_membership_id uuid references public.memberships(id) on delete set null,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),check(maximum_score>0),check(final_score is null or(final_score>=0 and final_score<=maximum_score)));
create unique index if not exists student_course_results_final_unique on public.student_course_results(student_id,course_assignment_id,academic_year_id) where academic_period_id is null;
create unique index if not exists student_course_results_period_unique on public.student_course_results(student_id,course_assignment_id,academic_year_id,academic_period_id) where academic_period_id is not null;
create table if not exists public.student_update_reads(id uuid primary key default gen_random_uuid(),update_id uuid not null references public.student_updates(id) on delete cascade,profile_id uuid not null references public.profiles(id) on delete cascade,read_at timestamptz not null default now(),unique(update_id,profile_id));
create table if not exists public.student_update_attachments(id uuid primary key default gen_random_uuid(),update_id uuid not null references public.student_updates(id) on delete cascade,storage_path text not null unique,file_name text not null,mime_type text not null,size_bytes bigint,created_by_profile_id uuid not null references public.profiles(id),created_at timestamptz not null default now());
create table if not exists public.push_device_tokens(id uuid primary key default gen_random_uuid(),profile_id uuid not null references public.profiles(id) on delete cascade,expo_push_token text not null unique,device_platform text not null check(device_platform in('ios','android','web')),device_label text,is_active boolean not null default true,last_seen_at timestamptz not null default now(),created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.student_transport_details(student_id uuid primary key references public.students(id) on delete cascade,institution_id uuid not null references public.institutions(id) on delete cascade,arrival_method text,departure_method text,authorized_pickup_names text[] not null default '{}',transport_provider text,notes text,updated_at timestamptz not null default now(),updated_by_profile_id uuid references public.profiles(id));
create table if not exists public.guardian_claim_tokens(id uuid primary key default gen_random_uuid(),institution_id uuid not null references public.institutions(id) on delete cascade,student_id uuid not null references public.students(id) on delete cascade,token_hash text not null unique,relationship text not null,expires_at timestamptz not null,max_uses int not null default 1 check(max_uses between 1 and 5),use_count int not null default 0 check(use_count>=0),revoked_at timestamptz,created_by_membership_id uuid not null references public.memberships(id),created_at timestamptz not null default now());
create table if not exists public.auth_login_attempts(identifier_hash text primary key,attempts int not null default 0,window_started_at timestamptz not null default now(),locked_until timestamptz,updated_at timestamptz not null default now());
create table if not exists public.attendance_justifications(id uuid primary key default gen_random_uuid(),institution_id uuid not null references public.institutions(id) on delete cascade,student_id uuid not null references public.students(id) on delete cascade,attendance_local_date date not null,reason text not null check(length(btrim(reason)) between 5 and 2000),attachment_path text,status text not null default 'PENDING' check(status in('PENDING','APPROVED','REJECTED')),submitted_by_profile_id uuid not null references public.profiles(id),reviewed_by_membership_id uuid references public.memberships(id),reviewed_at timestamptz,review_notes text,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(student_id,attendance_local_date,submitted_by_profile_id));
create table if not exists public.institutional_content(id uuid primary key default gen_random_uuid(),institution_id uuid not null references public.institutions(id) on delete cascade,content_type text not null check(content_type in('RECOMMENDATION','PROMOTION')),title text not null,description text not null,image_path text,cta_label text,cta_url text,target_student_id uuid references public.students(id) on delete cascade,target_classroom_id uuid references public.classrooms(id) on delete cascade,starts_at timestamptz not null default now(),ends_at timestamptz,status text not null default 'DRAFT' check(status in('DRAFT','PUBLISHED','ARCHIVED')),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),check(ends_at is null or ends_at>starts_at));
create index if not exists idx_academic_periods_institution_year on public.academic_periods(institution_id,academic_year_id,period_order);
create index if not exists idx_student_course_results_student_year on public.student_course_results(student_id,academic_year_id,status);
create index if not exists idx_student_update_reads_profile on public.student_update_reads(profile_id,read_at desc);
create index if not exists idx_student_update_attachments_update on public.student_update_attachments(update_id);
create index if not exists idx_push_device_tokens_profile on public.push_device_tokens(profile_id) where is_active;
create index if not exists idx_guardian_claim_tokens_student on public.guardian_claim_tokens(student_id,expires_at) where revoked_at is null;
create index if not exists idx_attendance_justifications_student_date on public.attendance_justifications(student_id,attendance_local_date desc);
create index if not exists idx_institutional_content_audience on public.institutional_content(institution_id,content_type,status,starts_at,ends_at);
alter table public.academic_periods enable row level security;
alter table public.student_course_results enable row level security;
alter table public.student_update_reads enable row level security;
alter table public.student_update_attachments enable row level security;
alter table public.push_device_tokens enable row level security;
alter table public.student_transport_details enable row level security;
alter table public.guardian_claim_tokens enable row level security;
alter table public.auth_login_attempts enable row level security;
alter table public.attendance_justifications enable row level security;
alter table public.institutional_content enable row level security;
revoke all on public.guardian_claim_tokens,public.auth_login_attempts from public,anon,authenticated;
grant all on public.guardian_claim_tokens,public.auth_login_attempts to service_role;
grant select on public.academic_periods,public.student_course_results,public.student_update_reads,public.student_update_attachments,public.student_transport_details,public.institutional_content to authenticated;
grant insert,update,delete on public.student_update_reads to authenticated;
grant select,insert,update,delete on public.push_device_tokens to authenticated;
grant select,insert,update on public.attendance_justifications to authenticated;
drop policy if exists academic_periods_select_access on public.academic_periods;
create policy academic_periods_select_access on public.academic_periods for select to authenticated using(private.can_access_institution(institution_id));
drop policy if exists academic_periods_admin_write on public.academic_periods;
create policy academic_periods_admin_write on public.academic_periods for all to authenticated using(private.is_institution_admin(institution_id)) with check(private.is_institution_admin(institution_id));
drop policy if exists student_course_results_student_read on public.student_course_results;
create policy student_course_results_student_read on public.student_course_results for select to authenticated using(status='PUBLISHED' and (exists(select 1 from public.students s join public.memberships m on m.id=s.membership_id where s.id=student_course_results.student_id and m.profile_id=(select auth.uid()) and m.role='STUDENT' and m.status='ACTIVE') or private.guardian_can_view(student_id,'GRADES')));
drop policy if exists student_course_results_staff_read on public.student_course_results;
create policy student_course_results_staff_read on public.student_course_results for select to authenticated using(private.is_institution_admin(institution_id) or exists(select 1 from public.course_assignments ca join public.memberships m on m.id=ca.teacher_membership_id where ca.id=student_course_results.course_assignment_id and m.profile_id=(select auth.uid()) and m.status='ACTIVE' and m.role='TEACHER'));
drop policy if exists student_course_results_staff_insert on public.student_course_results;
create policy student_course_results_staff_insert on public.student_course_results for insert to authenticated with check(private.is_institution_admin(student_course_results.institution_id) or exists(select 1 from public.course_assignments ca join public.memberships m on m.id=ca.teacher_membership_id where ca.id=student_course_results.course_assignment_id and ca.institution_id=student_course_results.institution_id and ca.status='ACTIVE' and m.id=student_course_results.published_by_membership_id and m.profile_id=(select auth.uid()) and m.status='ACTIVE' and m.role='TEACHER'));
drop policy if exists student_course_results_staff_update on public.student_course_results;
create policy student_course_results_staff_update on public.student_course_results for update to authenticated using(private.is_institution_admin(student_course_results.institution_id) or exists(select 1 from public.course_assignments ca join public.memberships m on m.id=ca.teacher_membership_id where ca.id=student_course_results.course_assignment_id and ca.institution_id=student_course_results.institution_id and ca.status='ACTIVE' and m.profile_id=(select auth.uid()) and m.status='ACTIVE' and m.role='TEACHER')) with check(private.is_institution_admin(student_course_results.institution_id) or exists(select 1 from public.course_assignments ca join public.memberships m on m.id=ca.teacher_membership_id where ca.id=student_course_results.course_assignment_id and ca.institution_id=student_course_results.institution_id and ca.status='ACTIVE' and m.id=student_course_results.published_by_membership_id and m.profile_id=(select auth.uid()) and m.status='ACTIVE' and m.role='TEACHER'));
drop policy if exists student_update_reads_owner_select on public.student_update_reads;
create policy student_update_reads_owner_select on public.student_update_reads for select to authenticated using(profile_id=(select auth.uid()));
drop policy if exists student_update_reads_owner_insert on public.student_update_reads;
create policy student_update_reads_owner_insert on public.student_update_reads for insert to authenticated with check(profile_id=(select auth.uid()) and exists(select 1 from public.student_updates u where u.id=update_id and private.can_read_update(u.institution_id,u.student_id,u.classroom_id,u.update_type)));
drop policy if exists student_update_reads_owner_update on public.student_update_reads;
create policy student_update_reads_owner_update on public.student_update_reads for update to authenticated using(profile_id=(select auth.uid())) with check(profile_id=(select auth.uid()));
drop policy if exists student_update_attachments_read on public.student_update_attachments;
create policy student_update_attachments_read on public.student_update_attachments for select to authenticated using(exists(select 1 from public.student_updates u where u.id=update_id and private.can_read_update(u.institution_id,u.student_id,u.classroom_id,u.update_type)));
drop policy if exists push_device_tokens_owner_all on public.push_device_tokens;
create policy push_device_tokens_owner_all on public.push_device_tokens for all to authenticated using(profile_id=(select auth.uid())) with check(profile_id=(select auth.uid()));
drop policy if exists student_transport_details_read on public.student_transport_details;
create policy student_transport_details_read on public.student_transport_details for select to authenticated using(private.is_institution_admin(institution_id) or private.can_access_student(student_id));
drop policy if exists student_transport_details_admin_write on public.student_transport_details;
create policy student_transport_details_admin_write on public.student_transport_details for all to authenticated using(private.is_institution_admin(institution_id)) with check(private.is_institution_admin(institution_id));
drop policy if exists attendance_justifications_read_related on public.attendance_justifications;
create policy attendance_justifications_read_related on public.attendance_justifications for select to authenticated using(private.is_institution_admin(institution_id) or private.can_access_student(student_id));
drop policy if exists attendance_justifications_submit_related on public.attendance_justifications;
create policy attendance_justifications_submit_related on public.attendance_justifications for insert to authenticated with check(submitted_by_profile_id=(select auth.uid()) and (exists(select 1 from public.students s join public.memberships m on m.id=s.membership_id where s.id=student_id and m.profile_id=(select auth.uid()) and m.role='STUDENT' and m.status='ACTIVE') or private.guardian_can_view(student_id,'ATTENDANCE')));
drop policy if exists attendance_justifications_review_staff on public.attendance_justifications;
create policy attendance_justifications_review_staff on public.attendance_justifications for update to authenticated using(private.is_institution_admin(institution_id) or private.has_institution_role(institution_id,array['ASSISTANT']::text[])) with check(private.is_institution_admin(institution_id) or private.has_institution_role(institution_id,array['ASSISTANT']::text[]));
drop policy if exists institutional_content_select_audience on public.institutional_content;
create policy institutional_content_select_audience on public.institutional_content for select to authenticated using(status='PUBLISHED' and starts_at<=now() and (ends_at is null or ends_at>=now()) and private.can_access_institution(institution_id) and (target_student_id is null or private.can_access_student(target_student_id)) and (target_classroom_id is null or private.can_access_classroom(target_classroom_id)));
drop policy if exists institutional_content_admin_write on public.institutional_content;
create policy institutional_content_admin_write on public.institutional_content for all to authenticated using(private.is_institution_admin(institution_id)) with check(private.is_institution_admin(institution_id));

-- Privileged functions: every entry point validates the authenticated actor.
create or replace function public.consume_login_attempt(p_identifier_hash text,p_reset boolean default false)
returns boolean language plpgsql security definer set search_path='' as $$
declare v_attempts integer;v_locked timestamptz;
begin
 if p_identifier_hash is null or p_identifier_hash !~ '^[a-f0-9]{64}$' then return false;end if;
 if p_reset then delete from public.auth_login_attempts where identifier_hash=p_identifier_hash;return true;end if;
 insert into public.auth_login_attempts(identifier_hash,attempts,window_started_at,updated_at) values(p_identifier_hash,1,now(),now())
 on conflict(identifier_hash) do update set attempts=case when public.auth_login_attempts.window_started_at<now()-interval '15 minutes' then 1 else public.auth_login_attempts.attempts+1 end,window_started_at=case when public.auth_login_attempts.window_started_at<now()-interval '15 minutes' then now() else public.auth_login_attempts.window_started_at end,locked_until=case when public.auth_login_attempts.window_started_at<now()-interval '15 minutes' then null when public.auth_login_attempts.attempts+1>=6 then now()+interval '15 minutes' else public.auth_login_attempts.locked_until end,updated_at=now()
 returning attempts,locked_until into v_attempts,v_locked;
 return v_attempts<=5 and(v_locked is null or v_locked<=now());
end $$;
revoke all on function public.consume_login_attempt(text,boolean) from public,anon,authenticated;
grant execute on function public.consume_login_attempt(text,boolean) to service_role;
create or replace function public.issue_guardian_claim_code(p_student_id uuid,p_relationship text default 'TUTOR',p_expires_in_hours integer default 72)
returns text language plpgsql security definer set search_path='' as $$
declare v_institution uuid;v_membership uuid;v_token text;v_hash text;
begin
 if auth.uid() is null then raise exception 'No autenticado' using errcode='42501';end if;
 select s.institution_id into v_institution from public.students s where s.id=p_student_id and s.status='ACTIVE';
 if v_institution is null or not private.is_institution_admin(v_institution) then raise exception 'No autorizado' using errcode='42501';end if;
 select m.id into v_membership from public.memberships m where m.profile_id=(select auth.uid()) and m.institution_id=v_institution and m.role='ADMIN' and m.status='ACTIVE' limit 1;
 if v_membership is null then raise exception 'Membresía administrativa no encontrada' using errcode='42501';end if;
 if p_relationship not in('MOTHER','FATHER','TUTOR','OTHER') or p_expires_in_hours<1 or p_expires_in_hours>168 then raise exception 'Parámetros no válidos';end if;
 v_token:=encode(extensions.gen_random_bytes(24),'hex');v_hash:=encode(extensions.digest(convert_to(v_token,'UTF8'),'sha256'),'hex');
 insert into public.guardian_claim_tokens(institution_id,student_id,token_hash,relationship,expires_at,created_by_membership_id) values(v_institution,p_student_id,v_hash,p_relationship,now()+make_interval(hours=>p_expires_in_hours),v_membership);return v_token;
end $$;
revoke all on function public.issue_guardian_claim_code(uuid,text,integer) from public,anon;
grant execute on function public.issue_guardian_claim_code(uuid,text,integer) to authenticated;
create or replace function public.claim_student_as_guardian(p_token text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_profile uuid;v_claim record;v_name text;
begin
 v_profile:=auth.uid();if v_profile is null then raise exception 'No autenticado' using errcode='42501';end if;
 if p_token is null or p_token !~ '^[a-f0-9]{48}$' then raise exception 'Código no válido o vencido';end if;
 select t.* into v_claim from public.guardian_claim_tokens t where t.token_hash=encode(extensions.digest(convert_to(p_token,'UTF8'),'sha256'),'hex') and t.revoked_at is null and t.expires_at>now() and t.use_count<t.max_uses for update;
 if not found then raise exception 'Código no válido o vencido';end if;
 select coalesce(p.display_name,u.raw_user_meta_data->>'full_name','Apoderado') into v_name from auth.users u left join public.profiles p on p.id=u.id where u.id=v_profile;
 insert into public.memberships(institution_id,profile_id,full_name,email,role,status) select v_claim.institution_id,v_profile,v_name,u.email,'GUARDIAN','ACTIVE' from auth.users u where u.id=v_profile on conflict do nothing;
 insert into public.guardian_student_links(institution_id,student_id,guardian_profile_id,relationship,status,verified_by,verified_at) values(v_claim.institution_id,v_claim.student_id,v_profile,v_claim.relationship,'ACTIVE',v_claim.created_by_membership_id,now()) on conflict do nothing;
 update public.guardian_claim_tokens set use_count=use_count+1 where id=v_claim.id;
 return jsonb_build_object('institution_id',v_claim.institution_id,'student_id',v_claim.student_id,'status','ACTIVE');
end $$;
revoke all on function public.claim_student_as_guardian(text) from public,anon;
grant execute on function public.claim_student_as_guardian(text) to authenticated;
create or replace function public.issue_my_attendance_qr()
returns text language plpgsql security definer set search_path='' as $$
declare v_student uuid;v_token text;v_hash text;
begin
 if auth.uid() is null then raise exception 'No autenticado' using errcode='42501';end if;
 select s.id into v_student from public.students s join public.memberships m on m.id=s.membership_id where m.profile_id=(select auth.uid()) and m.role='STUDENT' and m.status='ACTIVE' and s.status='ACTIVE' order by s.created_at desc limit 1;
 if v_student is null then raise exception 'No se encontró un alumno activo' using errcode='42501';end if;
 v_token:=encode(extensions.gen_random_bytes(32),'hex');v_hash:=encode(extensions.digest(convert_to(v_token,'UTF8'),'sha256'),'hex');
 update public.students set attendance_qr_hash=v_hash where id=v_student;return v_token;
end $$;
revoke all on function public.issue_my_attendance_qr() from public,anon;
grant execute on function public.issue_my_attendance_qr() to authenticated;
create or replace function public.get_my_student_guardians()
returns table(full_name text,relationship text,email text,phone text,status text)
language sql stable security definer set search_path='' as $$
 select m.full_name,gl.relationship,m.email,null::text,gl.status from public.students s join public.memberships sm on sm.id=s.membership_id join public.guardian_student_links gl on gl.student_id=s.id join public.memberships m on m.profile_id=gl.guardian_profile_id and m.institution_id=gl.institution_id and m.role='GUARDIAN' and m.status='ACTIVE' where sm.profile_id=(select auth.uid()) and sm.role='STUDENT' and sm.status='ACTIVE' and gl.status='ACTIVE'
$$;
revoke all on function public.get_my_student_guardians() from public,anon;
grant execute on function public.get_my_student_guardians() to authenticated;
create or replace function public.audit_redact_row(source_row jsonb)
returns jsonb language plpgsql immutable set search_path='' as $$
declare field_name text;field_value jsonb;safe_row jsonb:='{}'::jsonb;
begin
 if source_row is null then return null;end if;
 if jsonb_typeof(source_row)='array' then select coalesce(jsonb_agg(public.audit_redact_row(item)),'[]'::jsonb) into safe_row from jsonb_array_elements(source_row) as items(item);return safe_row;end if;
 if jsonb_typeof(source_row)<>'object' then return source_row;end if;
 for field_name,field_value in select key,value from jsonb_each(source_row) loop
  if field_name~*'(password|token|secret|access_code|login_code|device_key|email|phone|document|birth|name|address|description|body|notes|reference|qr_hash|claim_hash)' then safe_row:=safe_row||jsonb_build_object(field_name,'[REDACTED]');
  else safe_row:=safe_row||jsonb_build_object(field_name,case when jsonb_typeof(field_value) in('object','array') then public.audit_redact_row(field_value) else field_value end);end if;
 end loop;return safe_row;
end $$;
create or replace function public.generate_student_code()
returns text language plpgsql set search_path='' as $$
declare v_code text;
begin perform pg_catalog.pg_advisory_xact_lock(726381,1);loop v_code:='A'||pg_catalog.lpad((pg_catalog.floor(pg_catalog.random()*100000000)::bigint)::text,8,'0');exit when not exists(select 1 from public.students where student_code=v_code);end loop;return v_code;end $$;
create or replace function public.assign_student_code()
returns trigger language plpgsql set search_path='' as $$
begin if new.student_code is null or pg_catalog.btrim(new.student_code)='' then new.student_code:=public.generate_student_code();end if;return new;end $$;
revoke all on function public.capture_audit_log() from public,anon,authenticated;
revoke all on function public.teacher_can_manage_classroom(uuid,uuid,uuid,boolean) from public,anon;
grant execute on function public.teacher_can_manage_classroom(uuid,uuid,uuid,boolean) to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('student-update-attachments','student-update-attachments',false,10485760,array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=10485760,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists student_update_attachments_storage_read on storage.objects;
create policy student_update_attachments_storage_read on storage.objects for select to authenticated using(bucket_id='student-update-attachments' and exists(select 1 from public.student_update_attachments a join public.student_updates u on u.id=a.update_id where a.storage_path=name and private.can_read_update(u.institution_id,u.student_id,u.classroom_id,u.update_type)));
