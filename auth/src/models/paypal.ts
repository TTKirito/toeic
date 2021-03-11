import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PaypalAttrs {
  paypalId: string;
  userId: string;
  amout: number
}

export interface PaypalDoc extends mongoose.Document {
  paypalId: string;
  userId: string;
  version: number;
  amout: number
}

interface PaypalModel extends mongoose.Model<PaypalDoc> {
  build(attrs: PaypalAttrs): PaypalDoc;
}

const paypalSchema = new mongoose.Schema(
  {
    paypalId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    amout:{
        type: Number,
        required: true
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
paypalSchema.set('versionKey', 'version');
paypalSchema.plugin(updateIfCurrentPlugin);



paypalSchema.statics.build = (attrs: PaypalAttrs) => {
  return new Paypal(attrs);
};

const Paypal = mongoose.model<PaypalDoc, PaypalModel>('Paypal', paypalSchema);

export { Paypal };