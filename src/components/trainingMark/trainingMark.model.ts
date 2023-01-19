import mongoose, { Document, Model } from 'mongoose';

import { ITraningMark } from './trainingMark.types';

interface TrainingMarkDocument extends ITraningMark, Document { };
interface TrainingMarkModel extends Model<TrainingMarkDocument> { };

const TrainingMarkSchema = new mongoose.Schema<TrainingMarkDocument, TrainingMarkModel>({
    name: String,
    mark: Number
});

TrainingMarkSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function( doc, ret ) { delete ret._id }
})

const TrainingMark = mongoose.model<TrainingMarkDocument, TrainingMarkModel>('TrainingMark', TrainingMarkSchema);

export default TrainingMark;