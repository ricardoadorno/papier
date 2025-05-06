import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { DocumentService } from "../services/document.service";
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  DocumentResponseDto,
} from "../dtos/document.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("documents")
@Controller("documents")
export class DocumentController {
  constructor(private readonly service: DocumentService) {}

  @Post()
  @ApiOperation({ summary: "Create a new document" })
  @ApiResponse({
    status: 201,
    description: "The document has been successfully created.",
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request." })
  create(@Body() dto: CreateDocumentDto) {
    return this.service.create(dto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a document by ID" })
  @ApiParam({ name: "id", description: "Document ID" })
  @ApiResponse({
    status: 200,
    description: "The document has been found.",
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 404, description: "Document not found." })
  findById(@Param("id") id: string) {
    return this.service.findById(id);
  }

  @Get()
  @ApiOperation({ summary: "Get all documents" })
  @ApiResponse({
    status: 200,
    description: "List of documents.",
    type: [DocumentResponseDto],
  })
  findAll() {
    return this.service.findAll();
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a document" })
  @ApiParam({ name: "id", description: "Document ID" })
  @ApiResponse({
    status: 200,
    description: "The document has been successfully updated.",
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 400, description: "Bad request." })
  @ApiResponse({ status: 404, description: "Document not found." })
  update(@Param("id") id: string, @Body() dto: UpdateDocumentDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a document" })
  @ApiParam({ name: "id", description: "Document ID" })
  @ApiResponse({
    status: 200,
    description: "The document has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Document not found." })
  delete(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
