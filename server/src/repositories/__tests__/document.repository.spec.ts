import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../db/prisma.service";
import { Document } from "../../domains/document.entity";
import { PrismaDocumentRepository } from "../document.repository";

describe("PrismaDocumentRepository", () => {
  let repository: PrismaDocumentRepository;

  const mockPrismaService = {
    document: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockDocument: Document = {
    id: "doc123",
    title: "Test Document",
    content: "Test content",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user123",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaDocumentRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<PrismaDocumentRepository>(PrismaDocumentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a document", async () => {
      mockPrismaService.document.create.mockResolvedValue(mockDocument);

      const createData = {
        title: "Test Document",
        content: "Test content",
        userId: "user123",
      };

      const result = await repository.create(createData);

      expect(mockPrismaService.document.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(result).toEqual(mockDocument);
    });
  });

  describe("findById", () => {
    it("should find a document by id", async () => {
      mockPrismaService.document.findUnique.mockResolvedValue(mockDocument);

      const result = await repository.findById("doc123");

      expect(mockPrismaService.document.findUnique).toHaveBeenCalledWith({
        where: { id: "doc123" },
      });
      expect(result).toEqual(mockDocument);
    });

    it("should return null when document not found", async () => {
      mockPrismaService.document.findUnique.mockResolvedValue(null);

      const result = await repository.findById("nonexistent");

      expect(mockPrismaService.document.findUnique).toHaveBeenCalledWith({
        where: { id: "nonexistent" },
      });
      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("should return all documents", async () => {
      const mockDocuments = [mockDocument, { ...mockDocument, id: "doc456" }];
      mockPrismaService.document.findMany.mockResolvedValue(mockDocuments);

      const result = await repository.findAll();

      expect(mockPrismaService.document.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockDocuments);
    });
  });

  describe("update", () => {
    it("should update a document", async () => {
      const updatedDoc = { ...mockDocument, title: "Updated Title" };
      mockPrismaService.document.update.mockResolvedValue(updatedDoc);

      const updateData = { title: "Updated Title" };
      const result = await repository.update("doc123", updateData);

      expect(mockPrismaService.document.update).toHaveBeenCalledWith({
        where: { id: "doc123" },
        data: updateData,
      });
      expect(result).toEqual(updatedDoc);
    });
  });

  describe("delete", () => {
    it("should delete a document", async () => {
      mockPrismaService.document.delete.mockResolvedValue(mockDocument);

      await repository.delete("doc123");

      expect(mockPrismaService.document.delete).toHaveBeenCalledWith({
        where: { id: "doc123" },
      });
    });
  });
});
