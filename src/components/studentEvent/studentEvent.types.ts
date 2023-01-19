export interface IStudentEvent {
    mark: number
    trainingMarkId: string
    studentId: string
    eventId: string
}

export interface ICheckStudentEvent {
    studentId: string
    eventId: string
}