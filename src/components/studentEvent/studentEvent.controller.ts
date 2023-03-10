import { failedResponse, successResponse } from "../../utils/http";
import { Controller, Route, Tags, Post, Body, Get, Put, Delete } from "tsoa";
import { ICheckStudentEvent, ICheckStudentEventReq, IStudentEvent } from "./studentEvent.types";
import StudentEvent from "./studentEvent.model";
import Student from '../student/student.model';
import Event from '../event/event.model';
import { checkQuery, getEventBtStudentIdQueries, getStudentByEventIdQueries } from "./studentEvent.queries";

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
            const events = await Event.find({name: input.eventName});
            const data : ICheckStudentEvent = {
                eventId: events[0].id,
                studentId: students[0].id
            }
            await new StudentEvent(data).save();
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
    public async check1(@Body() input: ICheckStudentEventReq): Promise<any> {
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
                return successResponse('Bạn chưa đăng kí tham gia sự kiện này');
            }
            this.setStatus(200);
            if ( res[0].check==1)
                return successResponse('Bạn đã hoàn thành điểm danh');
            if ( res[0].check==0)
                return successResponse('Bạn chưa hoàn thành điểm danh');
        } catch( error ) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    @Get('event/{eventId}')
    public async getStudentByEventId(eventId: string): Promise<any> {
        try {
            const res = await StudentEvent.aggregate(getStudentByEventIdQueries(eventId));
            if ( res==null ){
                this.setStatus(404);
                return failedResponse('Not Found', 'NotFound');
            }
            return successResponse(res);
        } catch( error ) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    @Get('student/{studentId}')
    public async getEventByStuddentId(studentId: string): Promise<any> {
        try {
            const res = await StudentEvent.aggregate(getEventBtStudentIdQueries(studentId));
            if ( res==null ){
                this.setStatus(404);
                return failedResponse('Not Found', 'NotFound');
            }
            return successResponse(res);
        } catch( error ) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    @Put('check')
    public async check(@Body() input: ICheckStudentEventReq): Promise<any>{
        try{
            const students = await Student.find({mssv: input.studentMSSV});
            const events = await Event.find({name: input.eventName});
            const data : ICheckStudentEvent = {
                eventId: events[0].id,
                studentId: students[0].id
            }
            const studentEvent = await StudentEvent.find({eventId: data.eventId, studentId: data.studentId});
            await StudentEvent.findOneAndUpdate({eventId: data.eventId, studentId: data.studentId}, {check: 1});
            const student = await Student.findById(data.studentId);
            const event = await Event.findById(data.eventId);
            if ( studentEvent[0].check == 0)
                await Student.findByIdAndUpdate(data.studentId, {plus: student.plus + event.plus})
            return successResponse('updateSuccess');
        } catch (err) {
            return failedResponse(`Error: ${err}`, 'ServiceException');
        }
    }

    @Delete('delete')
    public async delete(@Body() input: ICheckStudentEventReq): Promise<any>{
        try{
            const students = await Student.find({mssv: input.studentMSSV});
            const events = await Event.find({name: input.eventName});
            const data : ICheckStudentEvent = {
                eventId: events[0].id,
                studentId: students[0].id
            }
            const studentEvent = await StudentEvent.find({eventId: data.eventId, studentId: data.studentId});
            await StudentEvent.findOneAndDelete({eventId: data.eventId, studentId: data.studentId});
            const student = await Student.findById(data.studentId);
            const event = await Event.findById(data.eventId);
            if ( studentEvent[0].check == 1)
                await Student.findByIdAndUpdate(data.studentId, {plus: student.plus - event.plus})
            return successResponse('deleteSuccess');
        } catch (err) {
            return failedResponse(`Error: ${err}`, 'ServiceException');
        }
    }

}


