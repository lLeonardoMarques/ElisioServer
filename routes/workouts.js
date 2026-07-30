const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// GET /api/workouts/:userId - Buscar Treinos do Usuário por ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const workouts = await Workout.find({ userId });
    res.json({ success: true, userId, workouts });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar treinos: ' + err.message });
  }
});

// POST /api/workouts/:userId - Admin/Aluno Atualizar Treinos do Usuário
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { workouts } = req.body;

    if (!Array.isArray(workouts)) {
      return res.status(400).json({ error: 'Lista de treinos inválida.' });
    }

    // Limpar treinos antigos e substituir pelos novos
    await Workout.deleteMany({ userId });

    const savedWorkouts = await Workout.insertMany(
      workouts.map(w => ({ ...w, userId }))
    );

    res.json({ success: true, message: 'Treinos salvos com sucesso no MongoDB!', workouts: savedWorkouts });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar treinos: ' + err.message });
  }
});

module.exports = router;
