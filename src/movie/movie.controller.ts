import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { MovieService } from "./movie.service";
import type MovieInt from "./interface/movie.interface";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { createMovieSchema, type CreateMovieDto } from "./dto/createMovieDto";
import { queryMovieSchema, type QueryMovieDto } from "./dto/QueryMovieDto";
import type { CategoryInt } from "./category/interface/category.interface";
import { HateoasIntercaptor } from "../common/hateoas/hateoas.intercaptor";
import type CollectionData from "../common/types/global.interface";
@Controller("movie")
export class MovieController {
  constructor(@Inject(MovieService) private readonly service: MovieService) {}

  @Get()
  @UseInterceptors(HateoasIntercaptor)
  async getAll(
    @Query(new ZodValidationPipe(queryMovieSchema)) query: QueryMovieDto
  ): Promise<CollectionData<MovieInt>> {
    return await this.service.getAll(query);
  }

  @Get(":id/category")
  async getMovieCategory(
    @Param("id", ParseIntPipe) id: number
  ): Promise<CategoryInt[]> {
    return await this.service.getMovieCategories(id)
  }

  @Get(":id")
  @UseInterceptors(HateoasIntercaptor)
  async getById(@Param("id", ParseIntPipe) id: number): Promise<MovieInt> {
    return await this.service.getById(id);
  }

  @Post()
  @UseInterceptors(HateoasIntercaptor)
  async create(
    @Body(new ZodValidationPipe(createMovieSchema)) dto: CreateMovieDto,
  ) {
    return await this.service.create(dto);
  }

  @Put(":id")
  @UseInterceptors(HateoasIntercaptor)
  async update(
    @Body(new ZodValidationPipe(createMovieSchema)) dto: CreateMovieDto,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<MovieInt> {
    return await this.service.update(dto, id);
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number): Promise<MovieInt> {
    return await this.service.delete(id);
  }
}
