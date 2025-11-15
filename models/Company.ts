import mongoose, { Document } from "mongoose";

export interface CompanyDocument extends Document {
  name: string;
  email: string;
  password: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  image:string
}

const companySchema = new mongoose.Schema<CompanyDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  password: { type: String, required: true },
});

const Comapany= mongoose.model('Company',companySchema);

export default Comapany;