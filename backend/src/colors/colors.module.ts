import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Color } from "./color.model";

@Module({
  imports: [TypeOrmModule.forFeature([Color])],
  providers: [ColorsService],
  exports: [ColorsService]
})
export class ColorsModule {

}
