import { Module } from "@nestjs/common";
import { DocumentController } from "./controllers/document.controller";
import { DocumentService } from "./services/document.service";
import {
  DocumentRepository,
  PrismaDocumentRepository,
} from "./repositories/document.repository";
import { PrismaModule } from "./db/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    {
      provide: DocumentRepository,
      useClass: PrismaDocumentRepository,
    },
  ],
  exports: [DocumentService],
})
export class DocumentsModule {}
