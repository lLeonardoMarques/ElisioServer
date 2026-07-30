const mongoose = require('mongoose');

const workoutHistorySchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    index: true,
    ref: 'User'
  },
  workoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: true
  },
  category: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'Cardio'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  duration: {
    type: Number, // minutos
    required: true
  },
  exercisesCompleted: {
    type: Number,
    default: 0
  },
  totalExercises: {
    type: Number,
    default: 0
  },
  exercises: [{
    id: String,
    name: String,
    sets: Number,
    reps: String,
    weight: Number,
    completed: Boolean,
    notes: String
  }],
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'workout_history'
});

workoutHistorySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('WorkoutHistory', workoutHistorySchema);