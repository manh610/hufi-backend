import mongoose, { Document, Model } from 'mongoose';

import { IEvent } from './event.types';

interface EventDocument extends IEvent, Document { };
interface EventModel extends Model<EventDocument> { };

const eventSchema = new mongoose.Schema<EventDocument, EventModel>({
    name: String,
    timeStart: Date,
    timeEnd: Date,
    address: String,
    teacherId : {
        type : mongoose.Types.ObjectId,
        ref : 'Teacher',
        require : true
    },
});

eventSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function( doc, ret ) { delete ret._id }
})

const Event = mongoose.model<EventDocument, EventModel>('Event', eventSchema);

export default Event;