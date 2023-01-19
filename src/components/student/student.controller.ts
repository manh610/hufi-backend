import { failedResponse, successResponse } from "../../utils/http";
import { Controller, Route, Tags, Post, Body } from "tsoa";
import { IStudent } from "./student.types";
import Student from "./student.model";


@Route('/students')
@Tags('Students')
export class StudentController extends Controller {

    /**
     * Create Student
     * @param data
     */
    @Post()
    public async create(@Body() data: IStudent): Promise<any>{
        try{
            await new Student(data).save();
            return successResponse('insertSuccess');
        } catch (err) {
            return failedResponse(`Error: ${err}`, 'ServiceException');
        }
    }

}


