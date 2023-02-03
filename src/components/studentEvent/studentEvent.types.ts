export interface IStudentEvent {
    studentId: string
    eventId: string
}

export interface ICheckStudentEvent {
    studentId: string
    eventId: string
}


export interface ICheckStudentEventReq {
    studentMSSV: string
    eventName: string
}