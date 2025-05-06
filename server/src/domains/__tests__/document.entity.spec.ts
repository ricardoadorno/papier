import { Document } from "../document.entity";

describe("Document Entity", () => {
  it("should define the Document interface with correct properties", () => {
    // Create a sample Document object
    const document: Document = {
      id: "123",
      title: "Test Document",
      content: "This is a test document",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user123",
    };

    // Verify all properties exist
    expect(document.id).toBeDefined();
    expect(document.title).toBeDefined();
    expect(document.content).toBeDefined();
    expect(document.createdAt).toBeDefined();
    expect(document.updatedAt).toBeDefined();
    expect(document.userId).toBeDefined();
  });

  it("should allow content to be optional", () => {
    // Create a Document without content
    const document: Document = {
      id: "123",
      title: "Test Document",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user123",
    };

    expect(document.content).toBeUndefined();
  });
});
