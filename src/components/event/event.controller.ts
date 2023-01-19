import { failedResponse, successResponse } from "../../utils/http";
import { Controller, Route, Tags, Post, Body, Get } from "tsoa";
import { IEvent, IReqGetEventInTime } from "./event.types";
import Event from "./event.model";
import { getEventById, getEventInTimeQuery } from "./event.queries";


@Route('/events')
@Tags('Events')
export class EventController extends Controller {

    /**
     * Create Student
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
            return successResponse(events[0]);
        } catch ( err ) {
            this.setStatus(500);
            return failedResponse(`${err}`, 'ServiceException');
        }
    }

}


