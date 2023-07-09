import mongoose, { Document, Schema, model } from 'mongoose';
import { UserDocument } from './User';

export type TokenDocument = Document & {
  id: mongoose.Types.ObjectId;
  token: string;
  revoke: boolean;
  userId: UserDocument;
};

const TokenSchema = new Schema<TokenDocument>(
  {
    token: { type: String, required: true, unique: true },
    revoke: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default model('Token', TokenSchema);
