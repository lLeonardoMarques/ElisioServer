const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Workout = require('../models/Workout');

// GET /api/admin/users - Listar todos os usuários
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// GET /api/admin/users/:userId - Buscar usuário específico
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId }, '-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// PUT /api/admin/users/:userId - Atualizar usuário
router.put('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    // Remover campos que não podem ser atualizados
    delete updates.userId;
    delete updates.password;
    delete updates.createdAt;
    delete updates.updatedAt;

    const user = await User.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso!',
      user
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// DELETE /api/admin/users/:userId - Remover usuário
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findOneAndDelete({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }
    
    // Remover treinos do usuário
    await Workout.deleteMany({ userId });
    
    res.json({
      success: true,
      message: 'Usuário e treinos removidos com sucesso'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// GET /api/admin/stats - Estatísticas do sistema
router.get('/stats', async (req, res) => {
  try {
    const [usersCount, workoutsCount, activeUsers] = await Promise.all([
      User.countDocuments(),
      Workout.countDocuments(),
      User.countDocuments({ status: 'ativo' })
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers: usersCount,
        activeUsers,
        totalWorkouts: workoutsCount,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

module.exports = router;