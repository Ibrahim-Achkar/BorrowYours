import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    // lastLogin: {
    //   type: String,
    //   required: true,
    //   default: new Date(),
    // },
    isDelete: {
      type: Boolean,
      required: true,
      default: false,
    },
    imageURL: {
      type: String,
      required: false,
      default: '',
    },
    favouriteThing: {
      type: String,
      required: false,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

//method for matching passwords after decrypting
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//middleware for encrypting a new password, runs pre-save of a new user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
