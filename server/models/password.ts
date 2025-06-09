import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

export interface IPwd {
  name: string;
  email: string;
  password: string;
  username: string;
  note: string;
  owner: mongoose.Types.ObjectId;
}

const pwdSchema = new Schema<IPwd>({
  name: {
    type: String,
    default: "Account",
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: "",
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: false,
    default: "",
    maxlength: 100,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

pwdSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.name = encrypt(this.name);
  }
  if (this.isModified("email")) {
    this.email = encrypt(this.email);
  }
  if (this.isModified("password")) {
    this.password = encrypt(this.password);
  }
  if (this.isModified("username")) {
    this.username = encrypt(this.username);
  }
  if (this.isModified("note")) {
    this.note = encrypt(this.note);
  }
  next();
});

const Pwd = models.Pwd || model("Pwd", pwdSchema);
export default Pwd;
