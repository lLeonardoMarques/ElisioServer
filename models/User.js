const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['admin', 'student_direct', 'student_gympass'], 
    default: 'student_direct',
    index: true
  },
  planName: { 
    type: String, 
    default: 'Plano Musculação' 
  },
  matriculaNumber: { 
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  gympassId: { 
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  status: { 
    type: String, 
    enum: ['ativo', 'pendente', 'suspenso', 'inativo'], 
    default: 'ativo',
    index: true
  },
  profileImage: { 
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: ''
  },
  birthDate: {
    type: Date,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true,
  collection: 'users'
});

// Middleware para gerar matrícula automaticamente
userSchema.pre('save', function(next) {
  if (!this.matriculaNumber && this.role !== 'admin') {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.matriculaNumber = `EF-${year}-${random}`;
  }
  
  if (!this.userId) {
    this.userId = 'u-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
  }
  
  next();
});

userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);