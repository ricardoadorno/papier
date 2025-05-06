import { CreateDocumentDto, UpdateDocumentDto } from "../document.dto";

describe("Document DTOs", () => {
  describe("CreateDocumentDto", () => {
    it("should validate valid input data", () => {
      const validData = {
        title: "Test Document",
        content: "This is the content",
        userId: "user123",
      };

      const result = CreateDocumentDto.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject input with missing title", () => {
      const invalidData = {
        content: "This is the content",
        userId: "user123",
      };

      const result = CreateDocumentDto.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should allow missing content", () => {
      const validData = {
        title: "Test Document",
        userId: "user123",
      };

      const result = CreateDocumentDto.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject input with missing userId", () => {
      const invalidData = {
        title: "Test Document",
        content: "This is the content",
      };

      const result = CreateDocumentDto.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("UpdateDocumentDto", () => {
    it("should validate input with both fields", () => {
      const validData = {
        title: "Updated Title",
        content: "Updated content",
      };

      const result = UpdateDocumentDto.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate input with only title", () => {
      const validData = {
        title: "Updated Title",
      };

      const result = UpdateDocumentDto.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should validate input with only content", () => {
      const validData = {
        content: "Updated content",
      };

      const result = UpdateDocumentDto.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept empty input object", () => {
      const emptyData = {};

      const result = UpdateDocumentDto.safeParse(emptyData);
      expect(result.success).toBe(true); // Empty is valid since all fields are optional
    });
  });
});
