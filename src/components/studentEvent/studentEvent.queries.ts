import { ICheckStudentEvent } from "./studentEvent.types";

import mongoose from "mongoose";

export const checkQuery = (data: ICheckStudentEvent): any => [
    {
        $match: {
            studentId: {$eq: mongoose.Types.ObjectId(data.studentId)},
            eventId: {$eq:  mongoose.Types.ObjectId(data.eventId)}
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