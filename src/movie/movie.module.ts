import { Module } from '@nestjs/common';
import { MovieService } from './movie.service.js';
import { MovieController } from './movie.controller.js';
import { CategoryModule } from './category/category.module.js';

@Module({
  imports: [CategoryModule],
  providers: [MovieService],
  controllers: [MovieController]
})
export class MovieModule {}
