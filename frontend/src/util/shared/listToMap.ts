interface Object {
    ID: string;
}

export default function listToMapWithID(objects: Object[]): Record<string, Object> {
    const map: Record<string, Object> = {};
    for (const o of objects) {
        map[o.ID] = o;
    }
    return map;
}