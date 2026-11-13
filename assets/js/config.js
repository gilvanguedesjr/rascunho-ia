// Configuração da página. Tudo que muda de campanha para campanha fica aqui.
window.CG_CONFIG = {
  // Supabase: URL do projeto e chave pública (anon/publishable).
  // A chave pública pode ficar no código: a tabela só aceita gravação pela função salvar_lead_rascunho.
  // Enquanto estiverem vazios, a página roda em modo de teste e NÃO salva os leads.
  SUPABASE_URL: "https://uqnqhmovkrklvfknbpyg.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_YKCkLqLof9YXV9cMQ_og9g_CCtyJVkP",

  // Meta Pixel da Comunidade Guedes
  PIXEL_ID: "1450677309633453",

  // Identificação da campanha (vai junto com cada lead)
  CAMPANHA: "rascunho-ia",
  ORIGEM_PADRAO: "instagram-dm"
};
