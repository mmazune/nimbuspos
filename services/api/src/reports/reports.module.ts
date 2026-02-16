import { Module, forwardRef } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportGeneratorService } from './report-generator.service';
import { RestaurantReportsService } from './restaurant-reports.service';
import { SubscriptionService } from './subscription.service';
import { CsvGeneratorService } from './csv-generator.service';
import { DashboardsModule } from '../dashboards/dashboards.module';
import { InventoryModule } from '../inventory/inventory.module';
import { FranchiseModule } from '../franchise/franchise.module';
import { StaffModule } from '../staff/staff.module';
import { FeedbackModule } from '../feedback/feedback.module';

@Module({
  imports: [
    forwardRef(() => DashboardsModule),
    forwardRef(() => InventoryModule),
    forwardRef(() => FranchiseModule),
    forwardRef(() => StaffModule),
    FeedbackModule,
  ],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    ReportGeneratorService,
    RestaurantReportsService,
    SubscriptionService,
    CsvGeneratorService,
  ],
  exports: [ReportsService, ReportGeneratorService, RestaurantReportsService, SubscriptionService, CsvGeneratorService],
})
export class ReportsModule {}
