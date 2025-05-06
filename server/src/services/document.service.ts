import { Injectable } from "@nestjs/common";
import { DocumentRepository } from "../repositories/document.repository";
import { Document } from "../domains/document.entity";
import { CreateDocumentDto, UpdateDocumentDto } from "../dtos/document.dto";

@Injectable()
export class DocumentService {
  constructor(private readonly repository: DocumentRepository) {}

  async create(dto: CreateDocumentDto): Promise<Document> {
    return this.repository.create(dto);
  }

  async findById(id: string): Promise<Document | null> {
    return this.repository.findById(id);
  }

  async findAll(): Promise<Document[]> {
    return this.repository.findAll();
  }

  async update(id: string, dto: UpdateDocumentDto): Promise<Document> {
    return this.repository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
