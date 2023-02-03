import { failedResponse, successResponse } from "../../utils/http";
import { Controller, Route, Tags, Post, Body, Get, Delete } from "tsoa";
import { IEvent, IReqGetEventInTime } from "./event.types";
import Event from "./event.model";
import { getAllEvent, getEventById, getEventInTimeQuery } from "./event.queries";


@Route('/events')
@Tags('Events')
export class EventController extends Controller {

    /**
     * Create event
     * @param data
     */
    @Post()
    public async create(@Body() data: IEvent): Promise<any>{
        try{
            await new Event(data).save();
            return successResponse('insertSuccess');
        } catch (err) {
            return failedResponse(`Error: ${err}`, 'ServiceException');
        }
    }

    /**
     * get event by id
     */
    @Get('{eventId}')
    public async getEventById(eventId: string): Promise<any> {
        try {
            const events = await Event.aggregate(getEventById(eventId));
            if (events == null) {
                this.setStatus(404);
                return failedResponse('Event is not found', 'EventNotFound');
            }
            return successResponse(events[0]);
        } catch ( err ) {
            this.setStatus(500);
            return failedResponse(`${err}`, 'ServiceException');
        }
    }

    @Get('')
    public async getAllEvent(): Promise<any> {
        try {
            const events = await Event.find({});
            return successResponse(events);
        } catch ( err ) {
            this.setStatus(500);
            return failedResponse(`${err}`, 'ServiceException');
        }
    }

    /**
     * get event in time
     */
    @Post('eventInTime')
    public async getEventInTime(@Body() data: IReqGetEventInTime): Promise<any> {
        try {
            const events = await Event.aggregate(getEventInTimeQuery(data));
            if (events == null) {
                this.setStatus(404);
                return failedResponse('Event is not found', 'EventNotFound');
            }
            return successResponse(events);
        } catch ( err ) {
            this.setStatus(500);
            return failedResponse(`${err}`, 'ServiceException');
        }
    }

    @Delete('/{eventId}')
    public async deleteTask(eventId: string): Promise<any>{
        try{
            if (await isExistEvents(eventId)) {
                let res = await Event.findByIdAndDelete(eventId);
                return successResponse(res);
            }
            this.setStatus(200);
            return failedResponse('Event is not found', 'EventNotFound');
        } catch (err) {
            return failedResponse(`Error: ${err}`, 'ServiceException');
        }
    }

}


const isExistEvents = async (memberId: string): Promise<boolean> => {
    const member = await Event.find({})
            .where('_id').equals(memberId)
            .exec();
    return member.length > 0;
}
