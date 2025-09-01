import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true, trim: true }
});

export default mongoose.model<IProduct>("Product", ProductSchema);