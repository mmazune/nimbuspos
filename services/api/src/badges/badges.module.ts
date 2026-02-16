import { Module } from '@nestjs/common';
import { BadgesController } from './badges.controller';
import { BadgesService } from './badges.service';
import { AuthModule } from '../auth/auth.module';
import { RedisService } from '../common/redis.service';

@Module({
  imports: [AuthModule],
  controllers: [BadgesController],
  providers: [BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}
