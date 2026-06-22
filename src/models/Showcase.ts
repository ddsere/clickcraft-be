import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IShowcaseItem {
    id?: number;
    name: string;
    price: string;
    desc: string;
    image?: string;   
    category: string; 
}

export interface IShowcase extends Document {
    user: Types.ObjectId;
    slug: string;
    title: string;
    theme: string;
    items: IShowcaseItem[];
}

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true, default: 'Electronics & Tech' }
});

const showcaseSchema: Schema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        slug: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        theme: { type: String, required: true },
        items: [itemSchema]
    },
    { timestamps: true }
);

const Showcase = mongoose.model<IShowcase>('Showcase', showcaseSchema);
export default Showcase;