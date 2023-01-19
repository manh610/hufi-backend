import mongoose, { Document, Model } from 'mongoose';

import { IStudentEvent } from './studentEvent.types';

interface StudentEventDocument extends IStudentEvent, Document { };
interface StudentEventModel extends Model<StudentEventDocument> { };

const studentEventSchema = new mongoose.Schema<StudentEventDocument, StudentEventModel>({
    mark: Number,
    eventId : {
        type : mongoose.Types.ObjectId,
        ref : 'Event',
        require : true
    },
    studentId : {
        type : mongoose.Types.ObjectId,
        ref : 'Student',
        require : true
    },
    traningMarkId : {
        type : mongoose.Types.ObjectId,
        ref : 'TrainingMark',
        require : true
    }
});

studentEventSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function( doc, ret ) { delete ret._id }
})

const StudentEvent = mongoose.model<StudentEventDocument, StudentEventModel>('StudentEvent', studentEventSchema);

export default StudentEvent;