import { compare, genSalt, hash } from 'bcrypt';
import mongoose, {
  CallbackWithoutResultAndOptionalError,
  Schema,
  model,
} from 'mongoose';

type ComparePasswordFunction = (
  plainPassword: string,
  cb: (err: Error | undefined, isMatch: boolean) => void
) => void;

export type UserDocument = Document & {
  id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  comparePassword: ComparePasswordFunction;
};

const UserSchema = new Schema<UserDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
  },
  { timestamps: true }
);

UserSchema.pre(
  'save',
  function save(next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password')) {
      return next();
    }
    genSalt(10, (err, salt) => {
      hash(this.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        this.password = hash;
        next();
      });
    });
  }
);

UserSchema.methods.comparePassword = function (
  plainPassword: string,
  cb: (err: Error | undefined, isMatch: boolean) => void
) {
  compare(
    plainPassword,
    this.password,
    (err: Error | undefined, isMatch: boolean) => {
      cb(err, isMatch);
    }
  );
};

export default model<UserDocument>('User', UserSchema);
