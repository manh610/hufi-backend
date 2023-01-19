
export const pick = <Obj>(data: { [ key: string ]: any }, pickedFields: string[]): Obj => {
    const result: { [ key: string ]: any } = {};

    for (const field of pickedFields) {
        if (field in data) {
            result[field] = data[field];
        }
    }

    return result as Obj;
};