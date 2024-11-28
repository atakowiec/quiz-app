import axios from "axios";

const IMG_UPLOAD_URL = import.meta.env.VITE_IMG_UPLOAD_URL;
const API_URL = import.meta.env.VITE_API_URL + "/questions";

export interface CreateQuestionRequest {
  question: string;
  photo?: string;
  correctAnswer: string;
  distractors: { content: string }[];
  category: { name: string }[];
}

export class QuestionService {
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

  static async createQuestion(data: CreateQuestionRequest): Promise<any> {
    try {
      const response = await axios.post(API_URL, {
        question: data.question,
        correctAnswer: data.correctAnswer,
        distractors: data.distractors,
        category: data.category,
        photo: data.photo || null,
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.data.message);
        throw new Error(`${error.response.data.message}`);
      } else {
        console.error("Error creating question:", error);
        throw new Error("Wyjątek podczas tworzenia pytania");
      }
    }
  }
}
