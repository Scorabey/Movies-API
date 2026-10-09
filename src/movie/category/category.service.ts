import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { CategoryInt } from './interface/category.interface';
import type { CreateCategoryDto } from './dto/createCategoryDto';

@Injectable()
export class CategoryService {
    constructor(
        @Inject(PrismaService) private readonly prisma: PrismaService
    ) {}

    async getAll(): Promise<CategoryInt[]> {
        return await this.prisma.db.orm.public.Category
            .select("id", "name")
            .all()
    }

    async getById(id: number): Promise<CategoryInt> {
        const category = await this.prisma.db.orm.public.Category
            .select("id", "name")
            .where({ id })
            .first()

        if(!category) throw new NotFoundException(`Category with id: ${id} not found`)

        return category
    }

    async create(dto: CreateCategoryDto): Promise<CategoryInt> {
        return await this.prisma.db.orm.public.Category
            .select("id", "name")
            .create(dto)
    }

    async update(dto: CreateCategoryDto, id: number): Promise<CategoryInt> {
        const category = await this.prisma.db.orm.public.Category
            .select("id", "name")
            .where({ id })
            .update(dto)

        if(!category) throw new NotFoundException(`Category with id: ${id} not found`)

        return category
    }

    async delete(id: number): Promise<CategoryInt> {
        const category = await this.prisma.db.orm.public.Category
            .select("id", "name")
            .where({ id })
            .delete()

        if(!category) throw new NotFoundException(`Category with id: ${id} not found`)

        return category
    }
}
