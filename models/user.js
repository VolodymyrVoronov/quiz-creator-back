import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  avatar: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
