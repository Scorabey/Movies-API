import { Injectable, type CallHandler, type ExecutionContext, type NestInterceptor } from "@nestjs/common";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators"
import type { Request } from 'express'
import type MovieInt from "../../movie/interface/movie.interface";

@Injectable()
export class HateoasIntercaptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<MovieInt[]>): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>()
        const host = `${request.protocol}://${request.get('host')}`

        const path = request.originalUrl.split('?')[0].replace(/\/$/, '')

        const collectionPath = request.params.id
            ? path.slice(0, path.lastIndexOf('/'))
            : path;

        const collectionUrl = `${host}${collectionPath}`

        console.log(path)

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
            map((data) => (Array.isArray(data) ? data.map(addLink) : addLink(data)))
        )
    }
}