# Alteracoes feitas no site

## Visual
- Tela inicial mantida com visual premium moderno.
- Formularios de login/cadastro mais profissionais, com icones, cards e melhor orientacao.
- Tela de agendamento agora mostra servico selecionado, preco, duracao e horarios em botoes.

## Cadastro e login
- Cadastro exige nome completo.
- Cadastro exige telefone/WhatsApp.
- Gmail/e-mail fica opcional para contato.
- Cliente comum entra principalmente com telefone + senha.
- Admin pode entrar com Gmail/e-mail + senha, desde que esse usuario exista no Supabase e esteja com role admin.

## Agendamento
- Cliente escolhe servico, profissional, data e horario.
- Horarios ocupados aparecem bloqueados na tela.
- O banco tambem bloqueia duplicidade: mesmo profissional, mesma data e mesmo horario nao podem ser agendados duas vezes enquanto estiver pending ou confirmed.

## Banco de dados
Se voce ainda NAO rodou o banco no Supabase, rode o arquivo completo:

supabase/schema.sql

Se voce JA tinha rodado o schema antes, rode tambem:

supabase/upgrade-modern-booking.sql

## Admin
A area admin continua em:

/admin

Para transformar um usuario em admin, rode no SQL Editor do Supabase:

update public.profiles
set role = 'admin'
where email = 'SEU_GMAIL_DE_ADMIN@gmail.com';

Nao coloque senha de admin dentro do codigo do site.
