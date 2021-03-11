import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface SectionAttrs {
  title: string;
  userId: string;
}

export interface SectionDoc extends mongoose.Document {
  title: string;
  userId: string;
  version: number;
}

interface SectionModel extends mongoose.Model<SectionDoc> {
  build(attrs: SectionAttrs): SectionDoc;
}

const sectionSchema = new mongoose.Schema(
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
      virtuals:true
    }
  }
);
sectionSchema.set('versionKey', 'version');
sectionSchema.plugin(updateIfCurrentPlugin);

sectionSchema.virtual('part', {
  ref: 'Part',
  localField: '_id',
  foreignField: 'section'
})

sectionSchema.statics.build = (attrs: SectionAttrs) => {
  return new Section(attrs);
};

const Section = mongoose.model<SectionDoc, SectionModel>('Section', sectionSchema);

export { Section };