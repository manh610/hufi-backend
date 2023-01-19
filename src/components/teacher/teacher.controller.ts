import { failedResponse, successResponse } from "../../utils/http";
import { Controller, Route, Tags, Post, Body } from "tsoa";
import { ITeacher, ITeacherLogin } from "./teacher.types";
import Teacher from "./teacher.model";
import { loginQuery } from "./teacher.queries";


@Route('/teachers')
@Tags('Teachers')
export class TeacherController extends Controller {

    /**
     * Create Teacher
     * @param data
     */
    @Post()
    public async create(@Body() data: ITeacher): Promise<any>{
        try{
            await new Teacher(data).save();
            return successResponse('insertSuccess');
        } catch (err) {
            return failedResponse(`Error: ${err}`, 'ServiceException');
        }
    }

    // login
    @Post('login')
    public async login(@Body() data: ITeacherLogin): Promise<any> {
        try {
            const teacher = await Teacher.aggregate(loginQuery(data));
            if ( teacher.length==0 ) {
                this.setStatus(404);
                return failedResponse('Teacher not found', 'TeacherNotFound');
            }
            this.setStatus(200);
            return successResponse(teacher[0]);
        } catch( error ) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }
    
}


