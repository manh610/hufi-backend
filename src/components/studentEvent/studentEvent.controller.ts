import { failedResponse, successResponse } from "../../utils/http";
import { Controller, Route, Tags, Post, Body } from "tsoa";
import { ICheckStudentEvent, IStudentEvent } from "./studentEvent.types";
import StudentEvent from "./studentEvent.model";
import { checkQuery } from "./studentEvent.queries";

@Route('/studentEvents')
@Tags('StudentEvents')
export class StudentEventController extends Controller {

    /**
     * Create Student-Event
     * @param data
     */
    @Post()
    public async create(@Body() data: IStudentEvent): Promise<any>{
        try{
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
    public async login(@Body() data: ICheckStudentEvent): Promise<any> {
        try {
            const res = await StudentEvent.aggregate(checkQuery(data));
            if ( res.length==0 ) {
                this.setStatus(404);
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


