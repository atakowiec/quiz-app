import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Color } from "./color.model";
import { ColorsController } from './colors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Color])],
  providers: [ColorsService],
  exports: [ColorsService],
  controllers: [ColorsController]
})
export class ColorsModule {

}
