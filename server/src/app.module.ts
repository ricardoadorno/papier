import { Module } from "@nestjs/common";
import { DocumentsModule } from "./documents.module";

@Module({
  imports: [DocumentsModule],
})
export class AppModule {}
