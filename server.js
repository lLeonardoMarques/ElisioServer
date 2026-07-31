require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const adminRoutes = require('./routes/admin');
const gympassRoutes = require('./routes/gympass');

const app = express();
const PORT = process.env.PORT || 10000; // Render usa porta dinâmica

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ ERRO: MONGODB_URI não definida no .env');
  process.exit(1);
}

console.log('🔄 Conectando ao MongoDB Atlas...');
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log('✅ Conectado ao MongoDB Atlas!');
  console.log(`📊 Banco: ${mongoose.connection.name}`);
})
.catch((err) => {
  console.error('❌ Erro MongoDB:', err.message);
  process.exit(1);
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gympass', gympassRoutes);

// Health Check para o Render
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando'
  };
  
  res.json({
    status: 'OK',
    server: 'ElisioFitness API',
    timestamp: new Date().toISOString(),
    database: {
      status: states[dbState] || 'Desconhecido',
      name: mongoose.connection.name || 'Não conectado'
    }
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🏋️ ElisioFitness API Server',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      workouts: '/api/workouts',
      admin: '/api/admin',
      gympass: '/api/gympass'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;