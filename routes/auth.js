const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register - Criar Novo Usuário
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, planName, gympassId, matriculaNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    const userId = 'u-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
    const userRole = role || 'student_direct';

    const newUser = new User({
      userId,
      name,
      email: email.toLowerCase(),
      password, // Em produção, utilize bcrypt.hash(password, 10)
      role: userRole,
      planName: planName || (userRole === 'student_gympass' ? 'Wellhub Gold' : userRole === 'admin' ? 'Administrador' : 'Plano Direto'),
      matriculaNumber: matriculaNumber || 'EF-' + Math.floor(1000 + Math.random() * 9000),
      gympassId: gympassId || (userRole === 'student_gympass' ? 'GP-' + Math.floor(10000000 + Math.random() * 90000000) : undefined)
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso no MongoDB Atlas!',
      user: {
        id: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        planName: newUser.planName,
        matriculaNumber: newUser.matriculaNumber
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor: ' + err.message });
  }
});

// POST /api/auth/login - Login de Usuário Existente
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Senha incorreta.' });
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
        gympassId: user.gympassId
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro de autenticação: ' + err.message });
  }
});

module.exports = router;
