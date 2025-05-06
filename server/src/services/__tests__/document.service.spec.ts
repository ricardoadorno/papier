import { Test, TestingModule } from "@nestjs/testing";
import { DocumentService } from "../document.service";
import { DocumentRepository } from "../../repositories/document.repository";
import { Document } from "../../domains/document.entity";
import { CreateDocumentDto, UpdateDocumentDto } from "../../dtos/document.dto";

describe("DocumentService", () => {
  let service: DocumentService;

  const mockDocument: Document = {
    id: "doc123",
    title: "Test Document",
    content: "Test content",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user123",
  };

  const mockDocumentRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: DocumentRepository,
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a document", async () => {
      const createDto: CreateDocumentDto = {
        title: "Test Document",
        content: "Test content",
        userId: "user123",
      };

      mockDocumentRepository.create.mockResolvedValue(mockDocument);

      const result = await service.create(createDto);

      expect(mockDocumentRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockDocument);
    });
  });

  describe("findById", () => {
    it("should find a document by id", async () => {
      mockDocumentRepository.findById.mockResolvedValue(mockDocument);

      const result = await service.findById("doc123");

      expect(mockDocumentRepository.findById).toHaveBeenCalledWith("doc123");
      expect(result).toEqual(mockDocument);
    });

    it("should return null when document not found", async () => {
      mockDocumentRepository.findById.mockResolvedValue(null);

      const result = await service.findById("nonexistent");

      expect(mockDocumentRepository.findById).toHaveBeenCalledWith(
        "nonexistent",
      );
      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return all documents", async () => {
      const mockDocuments = [mockDocument, { ...mockDocument, id: "doc456" }];
      mockDocumentRepository.findAll.mockResolvedValue(mockDocuments);

      const result = await service.findAll();

      expect(mockDocumentRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockDocuments);
    });
  });

  describe("update", () => {
    it("should update a document", async () => {
      const updateDto: UpdateDocumentDto = {
        title: "Updated Title",
      };
      const updatedDoc = { ...mockDocument, title: "Updated Title" };
      mockDocumentRepository.update.mockResolvedValue(updatedDoc);

      const result = await service.update("doc123", updateDto);

      expect(mockDocumentRepository.update).toHaveBeenCalledWith(
        "doc123",
        updateDto,
      );
      expect(result).toEqual(updatedDoc);
    });
  });

  describe("delete", () => {
    it("should delete a document", async () => {
      mockDocumentRepository.delete.mockResolvedValue(undefined);

      await service.delete("doc123");

      expect(mockDocumentRepository.delete).toHaveBeenCalledWith("doc123");
    });
  });
});
