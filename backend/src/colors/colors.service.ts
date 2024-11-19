import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Color } from "./color.model";
import { Repository } from "typeorm";

@Injectable()
export class ColorsService {
  private colors: string[] = [];

  constructor(@InjectRepository(Color) private colorRepository: Repository<Color>) {
    this.fetchColors().then(colors => this.colors = colors);
  }

  private async fetchColors(): Promise<string[]> {
    const colors = await this.colorRepository.find();

    return colors.map(color => color.color);
  }

  getColors() {
    return [...this.colors];
  }

  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }
}

