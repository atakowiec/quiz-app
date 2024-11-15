// categoryService.tsx

import axios from "axios";

export interface CreateCategoryRequest {
  categoryName: string;
  description: string;
  img: File;
}

export interface CreateCategoryResponse {
  id: string;
  name: string;
  description: string;
  img: string;
}

const IMG_UPLOAD_URL = import.meta.env.VITE_IMG_UPLOAD_URL;
const API_URL = import.meta.env.VITE_API_URL + "categories";

export class CategoryService {
  static async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(IMG_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data.url) {
        throw new Error("No file path returned from server");
      }

      return response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  }

  static async createCategory(
    data: CreateCategoryRequest,
  ): Promise<CreateCategoryResponse> {
    try {
      let imageUrl = "";

      if (data.img) {
        imageUrl = await this.uploadImage(data.img);
      }

      const response = await axios.post<CreateCategoryResponse>(API_URL, {
        name: data.categoryName,
        description: data.description,
        img: imageUrl,
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.data.message);
        throw new Error(`${error.response.data.message}`);
      } else {
        console.error("Error creating category:", error);
        throw new Error("Wyjątek podczas tworzenia kategorii");
      }
    }
  }
}
