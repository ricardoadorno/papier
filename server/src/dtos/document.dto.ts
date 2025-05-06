import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

// Class-based DTOs with class-validator and Swagger decorators
export class CreateDocumentDto {
  @ApiProperty({
    description: "Document title",
    example: "My Document",
  })
  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  title: string;

  @ApiPropertyOptional({
    description: "Document content",
    example: "This is the content of my document",
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: "ID of the document owner",
    example: "user123",
  })
  @IsString()
  @IsNotEmpty({ message: "User ID is required" })
  userId: string;
}

export class UpdateDocumentDto {
  @ApiPropertyOptional({
    description: "Document title",
    example: "Updated Document Title",
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: "Document content",
    example: "Updated content of my document",
  })
  @IsString()
  @IsOptional()
  content?: string;
}

export class DocumentResponseDto {
  @ApiProperty({
    description: "Document ID",
    example: "doc123",
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: "Document title",
    example: "My Document",
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: "Document content",
    example: "This is the content of my document",
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: "ID of the document owner",
    example: "user123",
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: "Document creation date",
    example: "2025-05-05T12:00:00Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Document last update date",
    example: "2025-05-05T14:30:00Z",
  })
  updatedAt: Date;
}
