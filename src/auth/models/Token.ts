import mongoose, { Document, Schema, model } from 'mongoose';

type TokenDocument = Document & {
  id: mongoose.Types.ObjectId;
  token: string;
  revoke: boolean;
};

const TokenSchema = new Schema<TokenDocument>(
  {
    token: { type: String, required: true, unique: true },
    revoke: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model('Token', TokenSchema);
