import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaModule } from './prisma/prisma.module.js';
import { MovieModule } from './movie/movie.module.js';

@Module({
  imports: [PrismaModule, MovieModule],
  controllers: [
    AppController
  ],
  providers: [
    PrismaService
  ],
})
export class AppModule { }
