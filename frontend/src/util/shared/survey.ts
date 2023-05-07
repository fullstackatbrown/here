
export interface KVPair {
    key: string,
    value: any
}

export function mapToList<T>(map: Record<string, T>): KVPair[] {
    let list = [];
    for (const key in map) {
        list.push({ key: key, value: map[key] })
    }
    return list;
}