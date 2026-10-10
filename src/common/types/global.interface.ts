interface Meta {
    total: number
    limit: number
    page: number
    totalPages: number
    prev: number | null
    self: number
    next: number | null
    hasNext: boolean
    hasPrev: boolean
}

export default interface CollectionData<T> {
    data: T[]
    meta: Meta
}