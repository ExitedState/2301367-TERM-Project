import mongoose, { Schema, Document } from 'mongoose';

interface OurModelInterface extends Document {
  name: string;
  // Add more fields as needed
}

const OurModelSchema = new Schema({
  name: { type: String, required: true },
  // Define more fields here
});

const OurModel = mongoose.model<OurModelInterface>('OurModel', OurModelSchema);

export default OurModel;
