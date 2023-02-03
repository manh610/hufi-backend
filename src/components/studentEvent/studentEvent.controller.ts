import { failedResponse, successResponse } from "../../utils/http";
import { Controller, Route, Tags, Post, Body } from "tsoa";
import { ICheckStudentEvent, ICheckStudentEventReq, IStudentEvent } from "./studentEvent.types";
import StudentEvent from "./studentEvent.model";
import Student from '../student/student.model';
import Event from '../event/event.model';
import { checkQuery } from "./studentEvent.queries";

@Route('/studentEvents')
@Tags('StudentEvents')
export class StudentEventController extends Controller {

    /**
     * Create Student-Event
     * @param data
     */
    @Post()
    public async create(@Body() input: ICheckStudentEventReq): Promise<any>{
        try{
            const students = await Student.find({mssv: input.studentMSSV});
            const event = await Event.find({name: input.eventName});
            const data : ICheckStudentEvent = {
                eventId: event[0].id,
                studentId: students[0].id
            }
            await new StudentEvent(data).save();
            const student = await Student.findById(data.studentId);
            await Student.findByIdAndUpdate(data.studentId, {plus: student.plus+1})
            return successResponse('insertSuccess');
        } catch (err) {
            return failedResponse(`Error: ${err}`, 'ServiceException');
        }
    }

    /**
     * Check student - event
     * @param data 
     * @returns 
     */
    @Post('checkStudentEvent')
    public async login(@Body() input: ICheckStudentEventReq): Promise<any> {
        try {
            const student = await Student.find({mssv: input.studentMSSV});
            const event = await Event.find({name: input.eventName});
            const data : ICheckStudentEvent = {
                eventId: event[0].id,
                studentId: student[0].id
            }
            const res = await StudentEvent.aggregate(checkQuery(data));
            console.log(res);   
            if ( res.length==0 ) {
                this.setStatus(200);
                return successResponse('Bạn chưa điểm danh');
            }
            this.setStatus(200);
            return successResponse('Bạn đã hoàn thành điểm danh');
        } catch( error ) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

}


