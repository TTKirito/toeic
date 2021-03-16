import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Part } from './part';

interface SkillsAttrs {
  title: string;
  userId: string;
}

export interface SkillsDoc extends mongoose.Document {
  title: string;
  userId: string;
  version: number;
}

interface SkillsModel extends mongoose.Model<SkillsDoc> {
  build(attrs: SkillsAttrs): SkillsDoc;
}

const skillsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      virtuals: true
    },toObject:{
      virtuals: true
    }
  }
);
skillsSchema.set('versionKey', 'version');
skillsSchema.plugin(updateIfCurrentPlugin);

skillsSchema.virtual('part', {
    ref: 'Part',
    localField: '_id',
    foreignField: 'skills'
})

skillsSchema.pre('remove', async function(next){
  await Part.deleteMany({skills: this.id})
  next()
})


skillsSchema.statics.build = (attrs: SkillsAttrs) => {
  return new Skills(attrs);
};

const Skills = mongoose.model<SkillsDoc, SkillsModel>('Skills', skillsSchema);

export { Skills };