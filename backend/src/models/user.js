const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    maxlength: [20, 'Username must be less than 20 characters'],
    unique: [true, 'Username must be unique']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    maxlength: [50, 'Email must be less than 50 characters'],
    unique: [true, 'Email must be unique'] 
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'] ,
    select: false
  },
  role: { 
    type: String, 
    required: [true, 'Role is required'],
    enum: {
      values: ['admin', 'user'],
      message: '{VALUE} is not supported',
    },
    default: 'user',
  },
  firstName: { 
    type: String, 
    maxlength: [20, 'First name must be less than 20 characters']
  },
  lastName: { 
    type: String, 
    maxlength: [20, 'Last name must be less than 20 characters']
  },
  socialLinks: {
    website : {
      type: String,
      maxlength: [100, 'Website URL must be less than 100 characters']
    },
    facebook : {
      type: String,
      maxlength: [100, 'Facebook profile URL must be less than 100 characters']
    },
   instagram : {
      type: String,
      maxlength: [100, 'Instagram profile URL must be less than 100 characters']
    },
    linkedin : {
      type: String,
      maxlength: [100, 'LinkedIn profile URL must be less than 100 characters']
    },
    x : {
      type: String,
      maxlength: [100, 'X profile URL must be less than 100 characters']
    },
    youtube : {
      type: String,
      maxlength: [100, 'YouTube channel URL must be less than 100 characters']
    },
  },
}, {
  timestamps: true,
});


userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  // Hash the password
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);