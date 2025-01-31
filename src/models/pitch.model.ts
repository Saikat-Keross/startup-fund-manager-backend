import mongoose, { Document, Schema, Model } from 'mongoose';



const slideSchema = new mongoose.Schema({
    id: String,
    content: String,
    position: Number,
    type: String,
});

interface IPitch extends Document {
    fundraiser: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    slides: Array<typeof slideSchema>;
    createdBy: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId;
}

const PitchSchema: Schema = new Schema(
    {
        fundraiser: { type: mongoose.Schema.Types.ObjectId, ref: 'Fundraiser', required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        slides: [slideSchema],
    },
    {
        timestamps: true,
    }
);

const Pitch: Model<IPitch> = mongoose.model<IPitch>('Pitch', PitchSchema);

export default Pitch;
/* title: { type: String, required: true },
description: { type: String }, */