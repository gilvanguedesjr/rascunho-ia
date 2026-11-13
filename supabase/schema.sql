-- Leads da campanha RASCUNHO (IA no Meta Ads)
-- Rodar uma vez no SQL Editor do Supabase.
-- A página pública NÃO lê nem escreve direto na tabela: só chama a função salvar_lead_rascunho.

create table if not exists public.leads_rascunho (
  id            uuid primary key,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  nome          text not null,
  whatsapp      text not null,
  email         text not null,
  perfil        text,
  faturamento   text,
  investimento  text,
  objetivo      text,
  completo      boolean not null default false,
  campanha      text,
  origem        text
);

alter table public.leads_rascunho enable row level security;
-- Sem nenhuma policy: visitantes (anon) não conseguem ler, alterar nem apagar nada.

create or replace function public.salvar_lead_rascunho(
  p_id uuid,
  p_nome text,
  p_whatsapp text,
  p_email text,
  p_perfil text default null,
  p_faturamento text default null,
  p_investimento text default null,
  p_objetivo text default null,
  p_completo boolean default false,
  p_campanha text default null,
  p_origem text default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_id is null
     or char_length(coalesce(p_nome, '')) not between 2 and 60
     or coalesce(p_whatsapp, '') !~ '^[0-9]{10,13}$'
     or coalesce(p_email, '') !~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
     or char_length(p_email) > 120 then
    raise exception 'dados invalidos';
  end if;

  insert into public.leads_rascunho
    (id, nome, whatsapp, email, perfil, faturamento, investimento, objetivo, completo, campanha, origem)
  values
    (p_id, p_nome, p_whatsapp, lower(p_email), left(p_perfil, 80), left(p_faturamento, 80),
     left(p_investimento, 80), left(p_objetivo, 80), coalesce(p_completo, false), left(p_campanha, 60), left(p_origem, 160))
  on conflict (id) do update set
    nome = excluded.nome,
    whatsapp = excluded.whatsapp,
    email = excluded.email,
    perfil = coalesce(excluded.perfil, leads_rascunho.perfil),
    faturamento = coalesce(excluded.faturamento, leads_rascunho.faturamento),
    investimento = coalesce(excluded.investimento, leads_rascunho.investimento),
    objetivo = coalesce(excluded.objetivo, leads_rascunho.objetivo),
    completo = leads_rascunho.completo or excluded.completo,
    atualizado_em = now();
end;
$$;

revoke all on function public.salvar_lead_rascunho(uuid, text, text, text, text, text, text, text, boolean, text, text) from public;
grant execute on function public.salvar_lead_rascunho(uuid, text, text, text, text, text, text, text, boolean, text, text) to anon;
