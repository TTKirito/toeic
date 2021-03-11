import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { ExamDoc } from './exam';

interface SubmitAttrs {
  correct: number;
  incorrect: number;
  userId: string;
  exam: ExamDoc;
  noanswer: number
}

export interface SubmitDoc extends mongoose.Document {
    correct: number;
    incorrect: number;
    userId: string;
    version: number;
    noanswer: number
}

interface SubmitModel extends mongoose.Model<SubmitDoc> {
  build(attrs: SubmitAttrs): SubmitDoc;
}

const submitSchema = new mongoose.Schema(
  {
    correct: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    noanswer:{
      type: Number,
      required: true
    },
    incorrect: {
        type: Number,
        required: true,
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam'
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      virtuals: true
    }
  }
);
submitSchema.set('versionKey', 'version');
submitSchema.plugin(updateIfCurrentPlugin);



submitSchema.statics.build = (attrs: SubmitAttrs) => {
  return new Submit(attrs);
};

const Submit = mongoose.model<SubmitDoc, SubmitModel>('Submit', submitSchema);

export { Submit };