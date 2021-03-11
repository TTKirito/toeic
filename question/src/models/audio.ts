import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { QuestionDoc } from './question';

interface AudioAttrs {
  audio: Buffer;
  userId: string;
  question: QuestionDoc,
}

export interface AudioDoc extends mongoose.Document {
  audio: Buffer;
  userId: string;
  version: number;
  url: string;
  question: QuestionDoc
}

interface AudioModel extends mongoose.Model<AudioDoc> {
  build(attrs: AudioAttrs): AudioDoc;
}

const audioSchema = new mongoose.Schema(
  {
    audio: {
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
        delete ret.audio;
      }
    }
  }
);
audioSchema.set('versionKey', 'version');
audioSchema.plugin(updateIfCurrentPlugin);


audioSchema.statics.build = (attrs: AudioAttrs) => {
  return new Audio(attrs);
};

const Audio = mongoose.model<AudioDoc, AudioModel>('Audio', audioSchema);

export { Audio };