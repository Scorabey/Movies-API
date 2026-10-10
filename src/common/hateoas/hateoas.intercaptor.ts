import { Injectable, type CallHandler, type ExecutionContext, type NestInterceptor } from "@nestjs/common";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators"
import type { Request } from 'express'
import type MovieInt from "../../movie/interface/movie.interface";
import type CollectionData from "../types/global.interface";

function isCollection<T>(value: unknown): value is CollectionData<T> {
    return (
        typeof value === 'object' &&
        value !== null &&
        'data' in value &&
        Array.isArray((value as { data: unknown }).data)
    )
}

@Injectable()
export class HateoasIntercaptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<CollectionData<MovieInt>>): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>()
        const host = `${request.protocol}://${request.get('host')}`

        const path = request.originalUrl.split('?')[0].replace(/\/$/, '')

        const collectionPath = request.params.id
            ? path.slice(0, path.lastIndexOf('/'))
            : path;

        const collectionUrl = `${host}${collectionPath}`

        const addLink = (movie: MovieInt) => ({
            ...movie,
            _links: {
                self: { href: `${collectionUrl}/${movie.id}`, method: "GET" },
                update: { href: `${collectionUrl}/${movie.id}`, method: "PUT" },
                delete: { href: `${collectionUrl}/${movie.id}`, method: "DELETE" },
                collection: { href: `${collectionUrl}`, method: "GET" },
            }
        })

        return next.handle().pipe(
            map((res) => {
                if(Array.isArray(res)) {
                    return res.map(addLink)
                }

                if(isCollection<MovieInt>(res)) {
                    const { page, limit, prev, next } = res.meta
                    
                    return {
                        ...res,
                        data: res.data.map(addLink),
                        meta: {
                            ...res.meta,
                            _links: {
                                self: { href: `${collectionUrl}?page=${page}&limit=${limit}`, method: "GET" },
                                next: { href: `${collectionUrl}?page=${next}&limit=${limit}`, method: "GET" },
                                prev: { href: `${collectionUrl}?page=${prev}&limit=${limit}`, method: "GET" },
                            }
                        }
                    }
                }

                return addLink(res)
            })
        )
    }
}