const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register - Criar Novo Usuário
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      planName, 
      gympassId, 
      matriculaNumber,
      phone = ''  // 🔥 NOVO CAMPO RECEBIDO
    } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Nome, email e senha são obrigatórios.' 
      });
    }

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'E-mail já cadastrado.' 
      });
    }

    // Gerar IDs
    const userId = 'u-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
    const userRole = role || 'student_direct';

    // Criar novo usuário
    const newUser = new User({
      userId,
      name,
      email: email.toLowerCase(),
      password, // ⚠️ Em produção, use bcrypt.hash(password, 10)
      role: userRole,
      planName: planName || (
        userRole === 'student_gympass' ? 'Wellhub Gold' : 
        userRole === 'admin' ? 'Administrador' : 
        'Plano Direto'
      ),
      matriculaNumber: matriculaNumber || 'EF-' + Math.floor(1000 + Math.random() * 9000),
      gympassId: gympassId || (userRole === 'student_gympass' ? 'GP-' + Math.floor(10000000 + Math.random() * 90000000) : undefined),
      phone: phone || ''  // 🔥 SALVA O TELEFONE
    });

    await newUser.save();

    // Retornar sucesso (sem a senha)
    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso no MongoDB Atlas!',
      user: {
        id: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        planName: newUser.planName,
        matriculaNumber: newUser.matriculaNumber,
        gympassId: newUser.gympassId,
        phone: newUser.phone  // 🔥 RETORNA O TELEFONE
      }
    });

  } catch (err) {
    console.error('❌ Erro no registro:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erro no servidor: ' + err.message 
    });
  }
});

// POST /api/auth/login - Login de Usuário Existente
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuário não encontrado.' 
      });
    }

    // Verificar senha (em produção, use bcrypt.compare)
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false,
        error: 'Senha incorreta.' 
      });
    }

    // Retornar sucesso
    res.json({
      success: true,
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        planName: user.planName,
        matriculaNumber: user.matriculaNumber,
        gympassId: user.gympassId,
        phone: user.phone || ''  // 🔥 RETORNA O TELEFONE
      }
    });

  } catch (err) {
    console.error('❌ Erro no login:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erro de autenticação: ' + err.message 
    });
  }
});

// GET /api/auth/me/:userId - Buscar Usuário por ID
router.get('/me/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findOne({ userId });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuário não encontrado.' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        planName: user.planName,
        matriculaNumber: user.matriculaNumber,
        gympassId: user.gympassId,
        phone: user.phone || '',  // 🔥 RETORNA O TELEFONE
        joinedDate: user.joinedDate,
        status: user.status
      }
    });

  } catch (err) {
    console.error('❌ Erro ao buscar usuário:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao buscar usuário: ' + err.message 
    });
  }
});

// PUT /api/auth/me/:userId - Atualizar Usuário
router.put('/me/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    // Remover campos que não devem ser atualizados
    delete updates._id;
    delete updates.userId;
    delete updates.password;
    delete updates.createdAt;

    const user = await User.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuário não encontrado.' 
      });
    }

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso!',
      user: {
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        planName: user.planName,
        matriculaNumber: user.matriculaNumber,
        gympassId: user.gympassId,
        phone: user.phone || ''  // 🔥 RETORNA O TELEFONE
      }
    });

  } catch (err) {
    console.error('❌ Erro ao atualizar usuário:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erro ao atualizar usuário: ' + err.message 
    });
  }
});

module.exports = router;