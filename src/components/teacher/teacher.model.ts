import mongoose, { Document, Model } from 'mongoose';

import { ITeacher } from './teacher.types';

interface TeacherDocument extends ITeacher, Document { };
interface TeacherModel extends Model<TeacherDocument> { };

const teacherSchema = new mongoose.Schema<TeacherDocument, TeacherModel>({
    name: String,
    position: String,
    department: String,
    username: String,
    password: String
});

teacherSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function( doc, ret ) { delete ret._id }
})

const Teacher = mongoose.model<TeacherDocument, TeacherModel>('Teacher', teacherSchema);

export default Teacher;