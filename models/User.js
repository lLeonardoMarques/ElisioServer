const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student_direct', 'student_gympass'], default: 'student_direct' },
  planName: { type: String, default: 'Plano Musculação' },
  matriculaNumber: { type: String },
  gympassId: { type: String },
  joinedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['ativo', 'pendente', 'suspenso'], default: 'ativo' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
