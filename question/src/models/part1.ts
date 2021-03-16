import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Exam } from './exam';
import { PartDoc} from './part'
import { Question } from './question';

interface Part1Attrs {
  title: string;
  userId: string;
  part: PartDoc;
  money: number
}

export interface Part1Doc extends mongoose.Document {
  title: string;
  userId: string;
  part: PartDoc
  version: number;
  money: number;
  examId: string;
}

interface Part1Model extends mongoose.Model<Part1Doc> {
  build(attrs: Part1Attrs): Part1Doc;
}

const part1Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    part:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Part'
    },
    money:{
      type: Number,
      default:0
    },
    examId:{
      type: String
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      virtuals: true
    },
    toObject:{
      virtuals: true
    }
  }
);
part1Schema.set('versionKey', 'version');
part1Schema.plugin(updateIfCurrentPlugin);

part1Schema.virtual('question',{
  ref: 'Question',
  localField: '_id',
  foreignField: 'part1'
})



part1Schema.pre('remove', async function (next){
  await Question.deleteMany({part1: this.id})
  next()
})
 

part1Schema.statics.build = (attrs: Part1Attrs) => {
  return new Part1(attrs);
};

const Part1 = mongoose.model<Part1Doc, Part1Model>('Part1', part1Schema);

export { Part1 };