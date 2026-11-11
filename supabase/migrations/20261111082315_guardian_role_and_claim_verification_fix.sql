-- GUARDIAN is a first-class membership role. Claim verification stores a profile FK, not a membership FK.
alter table public.memberships drop constraint if exists memberships_role_check;
alter table public.memberships add constraint memberships_role_check check(role in('ADMIN','TEACHER','ASSISTANT','STUDENT','GUARDIAN'));
create or replace function public.claim_student_as_guardian(p_token text)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_profile uuid;v_claim record;v_name text;v_verified_by uuid;
begin
 v_profile:=auth.uid();
 if v_profile is null then raise exception 'No autenticado' using errcode='42501';end if;
 if p_token is null or p_token !~ '^[a-f0-9]{48}$' then raise exception 'Código no válido o vencido';end if;
 select t.* into v_claim from public.guardian_claim_tokens t where t.token_hash=encode(extensions.digest(convert_to(p_token,'UTF8'),'sha256'),'hex') and t.revoked_at is null and t.expires_at>now() and t.use_count<t.max_uses for update;
 if not found then raise exception 'Código no válido o vencido';end if;
 select m.profile_id into v_verified_by from public.memberships m where m.id=v_claim.created_by_membership_id and m.institution_id=v_claim.institution_id and m.role='ADMIN';
 if v_verified_by is null then raise exception 'El emisor del código ya no tiene permisos administrativos';end if;
 select coalesce(p.display_name,u.raw_user_meta_data->>'full_name','Apoderado') into v_name from auth.users u left join public.profiles p on p.id=u.id where u.id=v_profile;
 insert into public.memberships(institution_id,profile_id,full_name,email,role,status) select v_claim.institution_id,v_profile,v_name,u.email,'GUARDIAN','ACTIVE' from auth.users u where u.id=v_profile
 on conflict(institution_id,profile_id,role) do update set status='ACTIVE',full_name=excluded.full_name,email=excluded.email;
 insert into public.guardian_student_links(institution_id,student_id,guardian_profile_id,relationship,status,verified_by,verified_at) values(v_claim.institution_id,v_claim.student_id,v_profile,v_claim.relationship,'ACTIVE',v_verified_by,now())
 on conflict(student_id,guardian_profile_id) do update set relationship=excluded.relationship,status='ACTIVE',verified_by=excluded.verified_by,verified_at=excluded.verified_at;
 update public.guardian_claim_tokens set use_count=use_count+1 where id=v_claim.id;
 return jsonb_build_object('institution_id',v_claim.institution_id,'student_id',v_claim.student_id,'status','ACTIVE');
end $$;
revoke all on function public.claim_student_as_guardian(text) from public,anon;
grant execute on function public.claim_student_as_guardian(text) to authenticated;
