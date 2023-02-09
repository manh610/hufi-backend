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


export const getStudentByEventIdQueries = (eventId: string): any => [
    {
        $match: {
            eventId: {$eq:  mongoose.Types.ObjectId(eventId)}
        }
    },
    {
        $lookup : {
            from : 'students',
            let : {studentId : '$studentId'},
            as : 'student',
            pipeline : [
                {
                    $match: {
                        $expr: { $eq: ['$_id', '$$studentId']}
                    }
                },
                {
                    $project: {
                        _id : 0,
                        id: '$_id',
                        name: 1,
                        lop: 1,
                        mssv: 1,
                        dob: 1,
                        plus: 1
                    }
                }
            ]
        },
    },
    {
        $unwind: {
            path: '$student',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            _id: 0,
            id: '$_id',
            student: '$student',
            eventId: 1
        }
    }
]

export const getEventBtStudentIdQueries = (studentId: string): any => [
    {
        $match: {
            studentId : {$eq:  mongoose.Types.ObjectId(studentId)}
        }
    },
    {
        $lookup : {
            from : 'events',
            let : {eventId : '$eventId'},
            as : 'event',
            pipeline : [
                {
                    $match: {
                        $expr: { $eq: ['$_id', '$$eventId']}
                    }
                },
                {
                    $project: {
                        _id : 0,
                        id: '$_id',
                        name: 1,
                        timeStart: 1,
                        timeEnd: 1,
                        address: 1,
                        plus: 1,
                    }
                }
            ]
        },
    },
    {
        $unwind: {
            path: '$event',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $project: {
            _id: 0,
            id: '$_id',
            event: '$event',
            studentId: 1
        }
    }
]

