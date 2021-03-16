import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Audio } from './audio';
import { Image } from './image';
import { PartDoc } from './part';
import { Part1Doc } from './part1';
import { SectionDoc } from './section';
import { SkillsDoc } from './skill';

interface QuestionAttrs {
  title: string;
  userId: string;
  description: string
  part1: Part1Doc;
  dich?:string
  giaithich?:string;
  A:string;
  B:string;
  C:string;
  D:string;
  part?: Part1Doc;
  section?: SectionDoc;
  skills?: SkillsDoc;
  answer: string;
  audioUrl?: string;
  imageUrl?: string
}

export interface QuestionDoc extends mongoose.Document {
  title: string;
  userId: string;
  description: string;
  dich?:string;
  giaithich?:string;
  A:string;
  B:string;
  C:string;
  D:string;
  part?: PartDoc;
  section?: SectionDoc;
  skills?: SkillsDoc;
  answer: string;
  audioUrl?: string;
  imageUrl?: string
}

interface QuestionModel extends mongoose.Model<QuestionDoc> {
  build(attrs: QuestionAttrs): QuestionDoc;
}

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    dich: {
        type: String
    },
    userId: {
      type: String,
      required: true,
    },
    part1:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Part1'
    },
    part:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part'
    },
    section:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section'
    },
    skills:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skills'
    },
    giaithich:{
        type: String,
    },
    A: {
        type: String,
        required: true
    },
    B: {
        type: String,
        required: true
    },
    C: {
        type: String,
        required: true
    },
    D: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    answer:{
      type: String,
      required: true
    },
    audioUrl:{
      type: String
    },
    imageUrl:{
      type:String
      
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
questionSchema.set('versionKey', 'version');
questionSchema.plugin(updateIfCurrentPlugin);
questionSchema.pre('remove', async function (next){
    await Image.deleteMany({question: this.id})
    await Audio.deleteMany({question: this.id})
    next()
})


questionSchema.virtual('image',{
  ref:'Image',
  localField: '_id',
  foreignField: 'question'
})
questionSchema.virtual('audio',{
  ref:'Audio',
  localField: '_id',
  foreignField: 'question'
})

questionSchema.statics.build = (attrs: QuestionAttrs) => {
  return new Question(attrs);
};

const Question = mongoose.model<QuestionDoc, QuestionModel>('Question', questionSchema);

export { Question };