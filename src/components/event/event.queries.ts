import mongoose from "mongoose";
import { IReqGetEventInTime } from "./event.types";

const dataDetailResponseProjectEvent = {
    $project : {
        id: '$_id',
        _id : 0,
        name : 1,
        timeStart : 1,
        timeEnd : 1,
        address : 1,
        teacher : '$teacher'
    }
}

export const lookupSingleObjectTeacherByTeacherId = (): any => (
    [
        {
            $lookup : {
                from : 'teachers',
                let : {teacherId : '$teacherId'},
                as : 'teacher',
                pipeline : [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$teacherId']}
                        }
                    },
                    {
                        $project: {
                            _id : 0,
                            id: '$_id',
                            name : 1,
                            department: 1,
                            position: 1
                        }
                    }
                ]
            },
        },
        {
            $unwind: {
                path: '$teacher',
                preserveNullAndEmptyArrays: true
            }
        },
    ]
)

export const getEventById = (eventId: string): Array<Record<string, any>> => [
    {
        $match: {
            _id: {$eq: mongoose.Types.ObjectId(eventId)},
        }
    },
    ...lookupSingleObjectTeacherByTeacherId(),
    dataDetailResponseProjectEvent,
]

export const getAllEvent = (): Array<Record<string, any>> => [
    {
        $match: {
            _id: {$ne: ''}
        }
    },
    {
        $project : {
            id: '$_id',
            _id : 0,
            name : 1,
            timeStart : 1,
            timeEnd : 1,
            address : 1
        }
    },
    {
        $facet: {
            count: [{$count: 'total'}],
            items: [
                {$skip: +0},
                {$limit: +1000},
            ],
        },
    },
    {
        $project: {
            items: 1,
            total: {
                $cond: {
                    if: {$eq: [{$size: '$count'}, 0]},
                    then: 0,
                    else: {$arrayElemAt: ['$count.total', 0]}
                },
            },
        },
    },
]   


export const getEventInTimeQuery = (data: IReqGetEventInTime) : Array<Record<string, any>> => [
    {
        $match: {
            '$and': [
                {
                    timeStart: {'$lt': data.endTime}
                },
                {
                    timeEnd: {'$gt': data.startTime}
                }
            ]
        }
    },
    ...lookupSingleObjectTeacherByTeacherId(),
    dataDetailResponseProjectEvent,
]