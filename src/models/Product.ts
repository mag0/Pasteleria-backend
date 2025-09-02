import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    imagePublicId: string;
    category: string;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true, unique: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true, unique: true },
    imagePublicId: { type: String, required: true, unique: true },
    category: { type: String, required: true, trim: true },
});

export default mongoose.model<IProduct>("Product", ProductSchema);