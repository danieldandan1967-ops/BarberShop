# BarberShop Elite — Next.js + Supabase

Sistema profissional para barbearia com:

- Site público bonito e responsivo
- Login/cadastro de cliente
- Agendamento com banco de dados
- Admin Hub
- Gestão de serviços/preços/duração
- Gestão de agenda
- Confirmação/recusa/conclusão
- Link direto para WhatsApp do cliente
- RLS no Supabase para segurança
- Sem senha hardcoded no front-end

## 1. Instalar

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 2. Criar projeto no Supabase

Crie um projeto em https://supabase.com e copie:

- Project URL
- anon public key

Cole em `.env.local`.

## 3. Criar banco de dados

Abra o SQL Editor do Supabase e execute o arquivo:

```txt
supabase/schema.sql
```

## 4. Criar admin

1. Rode o projeto.
2. Acesse `/cadastro`.
3. Cadastre o e-mail do admin, por exemplo: `danicraftddd@gmail.com`.
4. No Supabase SQL Editor, rode:

```sql
update public.profiles
set role = 'admin'
where email = 'danicraftddd@gmail.com';
```

A senha fica no Supabase Auth, não no código. Esse é o jeito seguro.

## 5. Páginas

- `/` site público
- `/agendar` página de agendamento
- `/login` login
- `/cadastro` cadastro
- `/admin` painel administrativo

## Observação importante

Esse projeto já está estruturado do jeito certo para segurança, mas você ainda precisa configurar o Supabase com suas chaves reais.
