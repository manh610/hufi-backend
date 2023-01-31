import { failedResponse, successResponse } from "../../utils/http";
import { Controller, Route, Tags, Post, Body, Get, Put } from "tsoa";
import { IStudent, IUpdateMember } from "./student.types";
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

    @Get('')
    public async getAllEvent(): Promise<any> {
        try {
            const students = await Student.find({});
            return successResponse(students);
        } catch ( err ) {
            this.setStatus(500);
            return failedResponse(`${err}`, 'ServiceException');
        }
    }

    @Put('/{studentId}')
    public async updateMember(studentId: string, @Body() data: IUpdateMember): Promise<any>{
        try{
            if (await isExistMembers(studentId)) {
                await Student.findByIdAndUpdate(studentId, data);
                const member = await Student.findById(studentId);
                return successResponse(member);
            }
            this.setStatus(200);
            return failedResponse('Member is not found', 'MemberNotFound');
        } catch (err) {
            return failedResponse(`Error: ${err}`, 'ServiceException');
        }
    }
}



const isExistMembers = async (memberId: string): Promise<boolean> => {
    const member = await Student.find({})
            .where('_id').equals(memberId)
            .exec();
    return member.length > 0;
}
