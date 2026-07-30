const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  sets: { type: Number, default: 3 },
  reps: { type: String, default: '10-12' },
  targetWeightKg: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  notes: { type: String }
});

const workoutSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  category: { type: String, enum: ['A', 'B', 'C', 'D', 'Cardio'], required: true },
  description: { type: String },
  durationMinutes: { type: Number, default: 50 },
  exercises: [exerciseSchema]
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
