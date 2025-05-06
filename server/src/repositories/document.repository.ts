import { Injectable } from "@nestjs/common";
import { PrismaService } from "../db/prisma.service";
import { Document } from "../domains/document.entity";

export abstract class DocumentRepository {
  abstract create(data: Partial<Document>): Promise<Document>;
  abstract findById(id: string): Promise<Document | null>;
  abstract findAll(): Promise<Document[]>;
  abstract update(id: string, data: Partial<Document>): Promise<Document>;
  abstract delete(id: string): Promise<void>;
}

@Injectable()
export class PrismaDocumentRepository extends DocumentRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(data: Partial<Document>): Promise<Document> {
    return this.prisma.document.create({
      data: {
        title: data.title!,
        content: data.content,
        userId: data.userId!,
      },
    });
  }

  async findById(id: string): Promise<Document | null> {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Document[]> {
    return this.prisma.document.findMany();
  }

  async update(id: string, data: Partial<Document>): Promise<Document> {
    return this.prisma.document.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.document.delete({
      where: { id },
    });
  }
}
