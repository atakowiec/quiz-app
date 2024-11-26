import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../entities/category.model";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "../dtos/CreateCategory.dto";
import { UpdateCategoryDto } from "../dtos/UpdateCategory.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async getCategoryOrCreateByName(
    categoryName: string,
    description?: string,
    img?: string
  ): Promise<Category> {
    let category = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });
    if (!category) {
      category = this.categoryRepository.create({
        name: categoryName,
        description: description,
        img: img,
      });
      await this.categoryRepository.save(category);
    } else {
      category.description = description;
      category.img = img;
      await this.categoryRepository.save(category);
    }
    return category;
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async createCategory(categoryDto: CreateCategoryDto): Promise<Category> {
    await this.checkCategoryExistsOrThrow(categoryDto);
    const category = this.categoryRepository.create(categoryDto);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<void> {
    await this.checkCategoryExists(id);
    await this.categoryRepository.delete(id);
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.getCategoryOrThrow(id);
  }

  async updateCategory(id: number, categoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.getCategoryOrThrow(id);
    const existingCategory = categoryDto.name ? await this.getCategoryByName(categoryDto.name) : null;

    if(existingCategory && existingCategory.id != category.id) {
      throw new HttpException("Kategoria z tą nazwą już istnieje!", 400);
    }

    category.name = categoryDto.name ?? category.name;
    category.description = categoryDto.description ?? category.description;
    category.img = categoryDto.img ?? category.img;

    return this.categoryRepository.save(category);
  }

  private async getCategoryOrThrow(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });

    if (!category) {
      throw new HttpException("Category not found", 404);
    }
    return category;
  }

  private async checkCategoryExists(id: number) {
    if (!(await this.categoryRepository.exists({ where: { id: id } }))) {
      throw new HttpException("Category not found", 404);
    }
  }

  private async getCategoryByName(name: string) {
    return await this.categoryRepository.findOne({ where: { name: name } });
  }

  private async checkCategoryExistsOrThrow(categoryDto: CreateCategoryDto) {
    if (await this.getCategoryByName(categoryDto.name)) {
      throw new HttpException("Kategoria z tą nazwą już istnieje!", 400);
    }
  }
}
