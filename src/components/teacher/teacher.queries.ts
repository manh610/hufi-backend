import { ITeacherLogin } from "./teacher.types";

export const loginQuery = (data: ITeacherLogin): any => [
    {
        $match: {
            username: {$eq: data.username},
            password: {$eq: data.password}
        }
    },
    {
        $project: {
            _id: 0,
            id: '$_id',
            name: 1,
            department: 1,
            position: 1,
            username: 1
        }
    }
];