import { CategoryService } from "../services/category.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CreateCategoryDto } from "../dtos/CreateCategory.dto";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Get(":id")
  getCategoryById(@Param("id") id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Delete(":id")
  deleteCategory(@Param("id") id: number) {
    return this.categoryService.deleteCategory(id);
  }

  @Put(":id")
  updateCategory(
    @Param("id") id: number,
    @Body() createCategoryDto: CreateCategoryDto
  ) {
    return this.categoryService.updateCategory(id, createCategoryDto);
  }
}
