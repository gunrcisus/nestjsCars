import { Controller ,Post , Body, UseGuards , Patch , Param ,Get ,Query } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {

    constructor(private reportsService: ReportsService){}

    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    @Post()
    createReport(@Body() body: CreateReportDto , @CurrentUser() user: User){
        return this.reportsService.create(body , user);
    }

    @UseGuards(AdminGuard)
    @Patch('/:id')
    approveReport(@Param('id') id:string, @Body() body: ApproveReportDto){
        return this.reportsService.changeApproval(id, body.approved);
    }

   
    @Get()
    getEstimate(@Query() query : GetEstimateDto){
        return this.reportsService.createEstimate(query);
    }

}
