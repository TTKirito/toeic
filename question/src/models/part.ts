import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Part1 } from './part1';
import { SectionDoc } from './section';
import { SkillsDoc } from './skill';

interface PartAttrs {
  title: string;
  userId: string;
  description: string;
  expiresAt: number;
  section: SectionDoc
  skills: SkillsDoc
}

export interface PartDoc extends mongoose.Document {
  title: string;
  userId: string;
  version: number;
  description:string;
  expiresAt: number;
}

interface PartModel extends mongoose.Model<PartDoc> {
  build(attrs: PartAttrs): PartDoc;
}

const partSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    description:{
        type: String,
        required: true,
    },
    expiresAt: {
       type: Number
    },
    section:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
    },
    skills:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skills'
    },
    
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      virtuals: true
    },toObject:{
      virtuals:true
    }
  }
);
partSchema.set('versionKey', 'version');
partSchema.plugin(updateIfCurrentPlugin);

partSchema.virtual('part1',{
    ref: 'Part1',
    localField: '_id',
    foreignField: 'part'
})

partSchema.pre('remove', async function (next){
  const part1 = this
  await Part1.deleteMany({part: part1.id})
  next()
})
partSchema.statics.build = (attrs: PartAttrs) => {
  return new Part(attrs);
};

const Part = mongoose.model<PartDoc, PartModel>('Part', partSchema);

export { Part };