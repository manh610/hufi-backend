export const lookupSingleObjectUser = (): any => (
    [
        {
            $lookup: {
                from: 'users',
                let: {ownerId: '$ownerId'},
                as: 'user',
                pipeline: [
                    {
                        $match: {
                            $expr: {$eq: ['$_id', '$$ownerId']}
                        }
                    },
                    {
                        $project: {
                            id: '$_id',
                            _id: 0,
                            name: 1,
                            email: 1,
                            fullName: 1,
                            phone: 1,
                            dob: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true
            }
        }
    ]
);

export const lookupSingleObjectCamera = (): any => (
    [
        {
            $lookup: {
                from: 'cameras',
                let: {cameraId: '$cameraId'},
                as: 'camera',
                pipeline: [
                    {
                        $match: {
                            $expr: {$eq: ['$_id', '$$cameraId']}
                        }
                    },
                    {
                        $project: {
                            id: '$_id',
                            _id: 0,
                            name: 1,
                            link: 1,
                            note: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: '$camera',
                preserveNullAndEmptyArrays: true
            }
        }
    ]
);