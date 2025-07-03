import mongoose from "mongoose";
import { Password } from '../services/password';
import { transform } from "typescript";

//schema tell mongoose what property user going to have.

// An interface that describe the properties
// that are required to create a new user.

interface UserAttrs {
  email: string,
  password: string
}

// interface User Model.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc: mongoose.Document, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    }
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  };
  done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// for type script checking.
// const buildUser = (attrs: UserAttrs) => {
//   return new User(attrs);
// }

// buildUser({
//   email: 'test@test.com',
//   password: 'password'
// })

// const user = User.build({
//   email: 'test@test.com',
//   password: 'asdsafewfd'
// });

export { User };