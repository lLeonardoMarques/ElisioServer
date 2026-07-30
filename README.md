# 🏋️ ElisioFitness - Servidor Backend & APIs MongoDB Atlas

Este é o servidor backend completo em **Node.js + Express + MongoDB Atlas** para a academia **ElisioFitness**.

## 🚀 Funcionalidades Incluídas
- **Conexão Mongoose ao MongoDB Atlas Online**
- **Autenticação JWT / Registro de Novos Usuários** (IDs únicos por usuário)
- **Gestão de Perfil de Usuários** (Alunos Diretos, Gympass/Wellhub, Administradores)
- **APIs de Treinos por Aluno (userId)** (Consulta, Criação, Alteração de Cargas e Fichas A, B, C pelo Aluno e pelo Admin)
- **Integração / Webhook Catraca Gympass / Wellhub**
- **Acesso Master Admin** para alterar e inserir treinos em qualquer usuário do sistema.

---

## 📋 Como Executar o Servidor Backend

### 1. Instalar as Dependências
```bash
npm install
```

### 2. Configurar o Banco MongoDB Atlas
Abra o arquivo `.env` e substitua `MONGODB_URI` pela sua URI do **MongoDB Atlas Online**:
```env
MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster0.mongodb.net/elisiofitness?retryWrites=true&w=majority
```

### 3. Iniciar o Servidor
```bash
npm start
```
O servidor rodará em `http://localhost:3000`.

---

## 📡 Endpoints das APIs (Rotas HTTP)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| **GET** | `/api/health` | Status do Servidor e Banco de Dados |
| **POST** | `/api/auth/register` | **Novo Usuário**: Registra novo aluno/admin com `userId` único |
| **POST** | `/api/auth/login` | **Login**: Autentica e retorna o perfil do usuário |
| **GET** | `/api/users` | **Admin**: Lista todos os usuários cadastrados no banco |
| **GET** | `/api/workouts/:userId` | Obtém as fichas de treino do usuário (`userId` específico) |
| **POST** | `/api/workouts/:userId` | **Admin/Aluno**: Insere ou atualiza treinos do usuário |
| **POST** | `/api/gympass/validate-checkin` | Valida token e check-in da catraca Wellhub/Gympass |

