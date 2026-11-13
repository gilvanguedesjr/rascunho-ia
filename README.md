# rascunho-ia

Página de captura da campanha **RASCUNHO** (Instagram → Direct → página): a pessoa comenta a palavra no post, recebe o link no direct, responde 7 perguntas e libera o passo a passo de como montar campanha no Meta Ads com IA.

Site estático (HTML, CSS e JS puros). Não tem build: é só publicar a pasta.

## Estrutura

```
index.html              página (abertura, perguntas e material)
assets/css/style.css    identidade visual da Comunidade Guedes (preto, branco e cinza)
assets/js/config.js     configurações: Supabase, Pixel e nome da campanha
assets/js/app.js        perguntas, validação, gravação do lead e botões de copiar
assets/img/             logo e favicon
supabase/schema.sql     tabela de leads e função de gravação
```

## Como funciona

1. O link do direct pode levar o primeiro nome: `?n=Gilvan`. A página usa o nome na saudação e já preenche a primeira pergunta.
2. Perguntas: nome, WhatsApp, e-mail, situação, faturamento, investimento em anúncio e o que quer que a IA faça primeiro.
3. Assim que a pessoa informa o e-mail, o contato já é salvo (mesmo que ela pare no meio). No fim, o cadastro é completado.
4. O material é liberado na mesma página e fica liberado naquele aparelho.

## Leads (Supabase)

- Projeto: `comunidade-guedes` · tabela `public.leads_rascunho`.
- A página não acessa a tabela direto. Ela chama a função `salvar_lead_rascunho`, que valida e grava. Visitantes não conseguem ler, alterar nem apagar leads.
- A chave em `config.js` é a chave pública (publishable). A chave secreta nunca entra neste repositório.
- Para ver os leads: Supabase → Table Editor → `leads_rascunho`. A coluna `completo` mostra quem respondeu tudo.

## Meta Pixel

Pixel `1450677309633453`. Eventos: `PageView` ao abrir, `Lead` quando o contato é salvo e `CompleteRegistration` ao terminar as perguntas.

## Editar

- Perguntas e opções: lista `PASSOS` em `assets/js/app.js`.
- Textos do material e o prompt: `index.html`.
- Outra campanha com a mesma página: trocar `CAMPANHA` em `assets/js/config.js`.

## Publicar

No ar em **https://comunidadeguedes.site** pelo GitHub Pages: todo push na `main` publica sozinho em cerca de um minuto.

- Domínio: arquivo `CNAME` na raiz. DNS na Hostinger: `A @ -> 185.199.108.153` e `CNAME www -> gilvanguedesjr.github.io`.
- Link para o direct:

```
https://comunidadeguedes.site/?n={{first_name}}&utm_source=instagram&utm_medium=dm&utm_campaign=rascunho
```
