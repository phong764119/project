const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const UsersSchema = new Schema(
  {
    username: String,
    password: String,
    user_level: Number,
    full_name: String,
  },
  { timestamps: true }
);

UsersSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UsersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = model("User", UsersSchema);
