# 📚 Plataforma Everyday Conversation

Plataforma de ensino de inglês com 20 semanas de conteúdo estruturado, incluindo aulas, músicas e séries para aprendizado interativo.

![Login Page](public/logo-everyday-red.jpg)

## 🚀 Tecnologias

- **React 19** - Biblioteca UI moderna
- **Vite 7** - Build tool rápido
- **Supabase** - Backend as a Service (Auth + Database)
- **React Router 7** - Navegação SPA
- **Lucide React** - Ícones modernos

## 📋 Funcionalidades

- ✅ Autenticação (Login/Registro)
- ✅ Recuperação de senha
- ✅ Rotas protegidas
- ✅ Player de vídeo com aulas
- ✅ Sistema de progresso
- ✅ Design responsivo
- ✅ Tema dark moderno

## 🛠️ Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>

# Entrar na pasta
cd plataforma-de-ensino-everyday

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase

# Rodar em desenvolvimento
npm run dev
```

### Build para Produção

```bash
npm run build
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

> ⚠️ **Importante**: Nunca commite o arquivo `.env` com credenciais reais!

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Button, Input, Card)
│   ├── CourseCard.jsx  # Card de curso
│   ├── ModuleList.jsx  # Lista de módulos
│   ├── ProtectedRoute.jsx # HOC para rotas autenticadas
│   └── Sidebar.jsx     # Barra lateral
├── lib/                # Configurações e APIs
│   ├── api/           # Chamadas ao Supabase
│   ├── courseContent.js # Conteúdo do curso
│   └── supabase.js    # Cliente Supabase
├── pages/              # Páginas da aplicação
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   ├── Dashboard.jsx
│   └── CoursePlayer.jsx
└── App.jsx            # Rotas principais
```

## 🎯 Conteúdo do Curso

O curso está organizado em **20 semanas** com:

- 📖 Aulas de gramática
- 🎵 Inglês com músicas
- 🎬 Inglês com séries
- 📝 Quizzes semanais
- 📄 Textos e áudios

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e de uso exclusivo da Everyday Conversation.

---

Desenvolvido com ❤️ para ensino de inglês.
