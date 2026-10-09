import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import type { CategoryInt } from './interface/category.interface';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createCategorySchema, type CreateCategoryDto } from './dto/createCategoryDto';

@Controller('category')
export class CategoryController {
    constructor(
        @Inject(CategoryService) private readonly service: CategoryService
    ) {}

    @Get()
    async getAll(): Promise<CategoryInt[]> {
        return await this.service.getAll()
    }

    @Get(":id")
    async getById(@Param("id", ParseIntPipe) id: number): Promise<CategoryInt> {
        return await this.service.getById(id)
    }

    @Post()
    async create(
        @Body(new ZodValidationPipe(createCategorySchema)) dto: CreateCategoryDto
    ): Promise<CategoryInt> {
        return await this.service.create(dto)
    }

    @Put(":id")
    async update(
        @Param("id", ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(createCategorySchema)) dto: CreateCategoryDto
    ): Promise<CategoryInt> {
        return await this.service.update(dto, id)
    }

    @Delete(":id")
    async delete(
        @Param("id", ParseIntPipe) id: number
    ): Promise<CategoryInt> {
        return this.service.delete(id)
    }
}
