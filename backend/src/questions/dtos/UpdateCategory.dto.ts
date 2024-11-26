import { IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateCategoryDto {
  @IsOptional()
  @IsString({
    message: "Name has to be a string",
  })
  name: string;

  @IsOptional()
  @IsString({
    message: "Description has to be a string",
  })
  description?: string;

  @IsOptional()
  @IsString({
    message: "Image has to be a string",
  })
  @IsUrl(
    {},
    {
      message: "Image has to be a valid URL",
    }
  )
  img?: string;
}
