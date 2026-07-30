const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/gympass/validate-checkin - Validar check-in Gympass/Wellhub
router.post('/validate-checkin', async (req, res) => {
  try {
    const { gympassId, userId, qrCode } = req.body;

    if (!gympassId && !userId && !qrCode) {
      return res.status(400).json({
        success: false,
        error: 'gympassId, userId ou qrCode é obrigatório.'
      });
    }

    let user = null;
    
    // Buscar por diferentes identificadores
    if (gympassId) {
      user = await User.findOne({ gympassId });
    } else if (userId) {
      user = await User.findOne({ userId });
    } else if (qrCode) {
      user = await User.findOne({ 
        $or: [{ gympassId: qrCode }, { userId: qrCode }] 
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado. Verifique seu código.'
      });
    }

    // Verificar status
    if (user.status !== 'ativo') {
      return res.status(403).json({
        success: false,
        error: `Usuário está ${user.status}. Contate a administração.`
      });
    }

    // Registrar entrada (log simplificado)
    console.log(`✅ Check-in registrado: ${user.name} - ${new Date().toISOString()}`);

    res.json({
      success: true,
      status: 'APPROVED',
      user: {
        id: user.userId,
        name: user.name,
        matriculaNumber: user.matriculaNumber,
        gympassId: user.gympassId,
        plan: user.planName,
        role: user.role
      },
      timestamp: new Date().toISOString(),
      message: 'Check-in validado com sucesso na catraca ElisioFitness!'
    });

  } catch (err) {
    console.error('Erro na validação Gympass:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST /api/gympass/webhook - Webhook para integração (simulado)
router.post('/webhook', (req, res) => {
  try {
    const { event, data } = req.body;
    console.log('📨 Webhook recebido:', { event, data });
    
    res.json({
      success: true,
      message: 'Webhook processado com sucesso'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;