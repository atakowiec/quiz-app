import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateCategoryDto {
  @IsString({
    message: "Name has to be a string",
  })
  @IsNotEmpty({
    message: "Name is required",
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
