import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { ExamStatus } from '@toeic/common';
import { Part1Doc } from './part1';



interface ExamAttrs {
  userId: string;
  status: ExamStatus;
  part1: Part1Doc;
  expiresAt?: Date
}

export interface ExamDoc extends mongoose.Document {
  userId: string;
  status: ExamStatus;
  part1: Part1Doc
  version: number;
  expiresAt?: Date
}

interface ExamModel extends mongoose.Model<ExamDoc> {
  build(attrs: ExamAttrs): ExamDoc;
}

const examSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(ExamStatus),
      default: ExamStatus.Created,
    },
    part1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part1',
    },
    expiresAt:{
      type: mongoose.Schema.Types.Date
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    },toObject:{
      virtuals: true
    }
  }
);

examSchema.set('versionKey', 'version');
examSchema.plugin(updateIfCurrentPlugin);

examSchema.statics.build = (attrs: ExamAttrs) => {
  return new Exam(attrs);
};

const Exam = mongoose.model<ExamDoc, ExamModel>('Exam', examSchema);

export { Exam };