import { Test, TestingModule } from "@nestjs/testing";
import { DocumentController } from "../document.controller";
import { DocumentService } from "../../services/document.service";
import { Document } from "../../domains/document.entity";
import { CreateDocumentDto, UpdateDocumentDto } from "../../dtos/document.dto";

describe("DocumentController", () => {
  let controller: DocumentController;

  const mockDocument: Document = {
    id: "doc123",
    title: "Test Document",
    content: "Test content",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user123",
  };

  const mockDocumentService = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        {
          provide: DocumentService,
          useValue: mockDocumentService,
        },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
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

      mockDocumentService.create.mockResolvedValue(mockDocument);

      const result = await controller.create(createDto);

      expect(mockDocumentService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockDocument);
    });
  });

  describe("findById", () => {
    it("should find a document by id", async () => {
      mockDocumentService.findById.mockResolvedValue(mockDocument);

      const result = await controller.findById("doc123");

      expect(mockDocumentService.findById).toHaveBeenCalledWith("doc123");
      expect(result).toEqual(mockDocument);
    });
  });

  describe("findAll", () => {
    it("should return all documents", async () => {
      const mockDocuments = [mockDocument, { ...mockDocument, id: "doc456" }];
      mockDocumentService.findAll.mockResolvedValue(mockDocuments);

      const result = await controller.findAll();

      expect(mockDocumentService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockDocuments);
    });
  });

  describe("update", () => {
    it("should update a document", async () => {
      const updateDto: UpdateDocumentDto = {
        title: "Updated Title",
      };
      const updatedDoc = { ...mockDocument, title: "Updated Title" };
      mockDocumentService.update.mockResolvedValue(updatedDoc);

      const result = await controller.update("doc123", updateDto);

      expect(mockDocumentService.update).toHaveBeenCalledWith(
        "doc123",
        updateDto,
      );
      expect(result).toEqual(updatedDoc);
    });
  });

  describe("delete", () => {
    it("should delete a document", async () => {
      mockDocumentService.delete.mockResolvedValue(undefined);

      await controller.delete("doc123");

      expect(mockDocumentService.delete).toHaveBeenCalledWith("doc123");
    });
  });
});
