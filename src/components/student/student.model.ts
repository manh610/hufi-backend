import mongoose, { Document, Model } from 'mongoose';

import { IStudent } from './student.types';

interface StudentDocument extends IStudent, Document { };
interface StudentModel extends Model<StudentDocument> { };

const studentSchema = new mongoose.Schema<StudentDocument, StudentModel>({
    name: String,
    dob: Date
});

studentSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function( doc, ret ) { delete ret._id }
})

const Student = mongoose.model<StudentDocument, StudentModel>('Student', studentSchema);

export default Student;