import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { QuestionDoc } from './question';

interface ImageAttrs {
  image: Buffer;
  userId: string;
  question: QuestionDoc,
}

export interface ImageDoc extends mongoose.Document {
  image: Buffer;
  userId: string;
  version: number;
  question: QuestionDoc
  url: string
}

interface ImageModel extends mongoose.Model<ImageDoc> {
  build(attrs: ImageAttrs): ImageDoc;
}

const imageSchema = new mongoose.Schema(
  {
    image: {
      type: Buffer,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    question:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    url:{
        type: String,
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.image;
      },
      virtuals: true
    },
    toObject:{
      virtuals: true
    }
  }
);
imageSchema.set('versionKey', 'version');
imageSchema.plugin(updateIfCurrentPlugin);


imageSchema.statics.build = (attrs: ImageAttrs) => {
  return new Image(attrs);
};

const Image = mongoose.model<ImageDoc, ImageModel>('Image', imageSchema);

export { Image };