const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const UsersSchema = new Schema(
  {
    username: String,
    password: String,
    email: Number,
    role: {
      type: String,
      enum: ["admin", "user"],
    },
    fullName: String,
    phone: String,
    points: { type: Schema.Types.Decimal128, default: 0 },
    confirmed: { type: Boolean, default: false },
    activate: { type: Boolean, default: true },
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
