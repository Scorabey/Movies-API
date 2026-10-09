import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { db } from "./db";

@Injectable()
export class PrismaService implements OnModuleDestroy {
  public readonly db = db;

  onModuleDestroy() {
    this.db.close()
  }
}
