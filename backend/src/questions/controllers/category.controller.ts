import { CategoryService } from "../services/category.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateCategoryDto } from "../dtos/CreateCategory.dto";
import { UpdateCategoryDto } from "../dtos/UpdateCategory.dto";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles, RolesEnum } from "../../guards/roles.decorator";

@Controller("categories")
@UseGuards(RolesGuard)
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
  @Roles([RolesEnum.ADMIN])
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Delete(":id")
  @Roles([RolesEnum.ADMIN])
  changeStatus(@Param("id") id: number) {
    return this.categoryService.changeStatus(id);
  }

  @Patch(":id")
  @Roles([RolesEnum.ADMIN])
  updateCategory(
    @Param("id") id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }
}
