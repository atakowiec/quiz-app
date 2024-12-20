import {Module} from '@nestjs/common';
import {ColorsService} from './service/colors.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Color} from "./model/color.model";
import {ColorsController} from './controllers/colors.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Color])],
    providers: [ColorsService],
    exports: [ColorsService],
    controllers: [ColorsController]
})
export class ColorsModule {

}
