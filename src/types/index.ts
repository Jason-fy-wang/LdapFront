export type RecordArray = {
    DN: string,
    Attributes?: Array<Object>
}

export type NodeData = {
    title: string
    key:string
    isLeaf: boolean
    children?: NodeData[]
}

