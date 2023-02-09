export interface IEvent {
    name: string
    timeStart: Date
    timeEnd: Date
    address: string
    plus: number
    teacherId: string
}

export interface IReqGetEventInTime {
    startTime: Date
    endTime: Date
}