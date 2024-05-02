export interface groupDataType {
    group: number;
    size: number;
    nodes: [];
}

export interface nodeType {
    id: string;
    group: number;
    group_data?: groupDataType;
    name?: string;
    val?: number;
}
