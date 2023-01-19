import { ICheckStudentEvent } from "./studentEvent.types";

export const checkQuery = (data: ICheckStudentEvent): any => [
    {
        $match: {
            studentId: {$eq: data.studentId},
            eventId: {$eq: data.eventId}
        }
    },
    {
        $project: {
            _id: 0,
            id: '$_id',
            mark: 1
        }
    }
];