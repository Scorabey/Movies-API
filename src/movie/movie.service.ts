import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type MovieInt from "./interface/movie.interface";
import type { CreateMovieDto } from "./dto/createMovieDto";
import type { QueryMovieDto } from "./dto/QueryMovieDto";
import type { CategoryInt } from "./category/interface/category.interface";
import type CollectionData from "../common/types/global.interface";

@Injectable()
export class MovieService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getAll(query: QueryMovieDto): Promise<CollectionData<MovieInt>> {
    const { limit, orderBy, page, sortBy, search, filterBy } = query;

    let base = this.prisma.db.orm.public.Movie.select(
      "id",
      "title",
      "description",
      "img",
    );

    if (search?.trim()) {
      const pattern = `%${search.trim()}%`;

      base = base.where((movie) => movie.title.ilike(pattern));
    }

    if(filterBy?.length) {
      for(const name of filterBy) {
        base = base.where((movie) => 
          movie.categories.some((category) => category.name.eq(name))   
        )
      }
    }

    const total = (await base.select("id").all()).length

    const finnal = await base
      .orderBy((order) =>
        orderBy === "asc" ? order[sortBy].asc() : order[sortBy].desc(),
      )
      .limit(limit)
      .offset(page)
      .include("categories")
      .all();

    const totalPages = Math.ceil(total / limit)

    return {
      data: finnal,
      meta: {
        total,
        limit,
        page,
        totalPages,
        prev: page > 0 ? page - 1 : null,
        self: page,
        next: page < totalPages - 1 ? page + 1 : null,
        hasPrev: page > 0,
        hasNext: page < totalPages - 1
      }
    } 
  }

  async getMovieCategories(id: number): Promise<CategoryInt[]> {
    const categories = await this.prisma.db.orm.public.MovieCategory.select(
      "categoryId",
    )
      .where({ movieId: id })
      .all();

    const categoriesId = categories.map((ids) => ids.categoryId);

    if (!categoriesId)
      throw new NotFoundException(`Categories with movie id: ${id} not found!`);

    return this.prisma.db.orm.public.Category.select("id", "name")
      .where((category) => category.id.in(categoriesId))
      .all();
  }

  async getById(id: number): Promise<MovieInt> {
    const movie = await this.prisma.db.orm.public.Movie.select(
      "id",
      "title",
      "description",
      "img",
    )
      .where({ id })
      .first();

    if (!movie) throw new NotFoundException(`movie with id: ${id} not found`);

    return movie;
  }

  async create(dto: CreateMovieDto): Promise<MovieInt> {
    return await this.prisma.db.transaction(async (tx) => {
      const { categoryIds, ...cleanDto } = dto;

      const movie = await tx.orm.public.Movie.select(
        "id",
        "title",
        "description",
        "img",
      ).create(cleanDto);

      await tx.orm.public.MovieCategory.createAll(
        dto.categoryIds.map((id) => ({
          movieId: movie.id,
          categoryId: id,
        })),
      );

      return movie;
    });
  }

  async update(dto: CreateMovieDto, id: number): Promise<MovieInt> {
    return await this.prisma.db.transaction(async (tx) => {
      const { categoryIds, ...cleanDto } = dto;

      const movie = await tx.orm.public.Movie.select(
        "id",
        "title",
        "description",
        "img",
      )
        .where({ id })
        .update(cleanDto);

      if (!movie) throw new NotFoundException(`movie with id: ${id} not found`);

      await tx.orm.public.MovieCategory.where({
        movieId: movie.id,
      }).deleteAll();

      await tx.orm.public.MovieCategory.createAll(
        dto.categoryIds.map((id) => ({
          movieId: movie.id,
          categoryId: id,
        })),
      );

      return movie;
    });
  }

  async delete(id: number): Promise<MovieInt> {
    return this.prisma.db.transaction(async () => {
      await this.prisma.db.orm.public.MovieCategory.where({ movieId: id }).delete()

      const movie = await this.prisma.db.orm.public.Movie.select(
        "id",
        "title",
        "description",
        "img",
      )
        .where({ id })
        .delete();

      if (!movie) throw new NotFoundException(`movie with id: ${id} not found`);

      return movie;
    })
  }
}
