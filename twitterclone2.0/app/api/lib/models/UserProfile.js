

import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userrealname: { type: String, required: true },
  username: { type: String, required: true, unique: true ,default:'anthony123'},
  email: { type: String, required: true, unique: true },
  profile: {
    displayName: { type: String },
    avatar: { type: String },
        bio: {
      type: String,
      maxlength: 160,
      default:"https://tse1.mm.bing.net/th?id=OIP.lcdOc6CAIpbvYx3XHfoJ0gHaF3&pid=Api&P=0&h=180"
    },
    location: {
      type: String,
      maxlength: 30,
      default:'earth'
    }

  },
  password:{type:String,select:false,default:''},
  checkpoint:{type:String,required: true, default:'not-verified'},
    isVerified: {
    type: Boolean,
    default: false
  },
  firstlogincreatedAt: {
    type: Date,
    default: Date.now,
    immutable: true // ensures this field can’t be changed after creation
  },
  lastLogin: Date,
  newsPreferences: {
  type: [String],
  default: [],
},
  
  followers: {
    count: { type: Number, default: 0 },
    users: [String],
  },
    following: {
    count: { type: Number, default: 0 },
    users: [String],
  },
 
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'},
  // authProvider: { type: String, required: true ,default:'credentials' },
}, { timestamps: true });

const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);

export default UserProfile;
