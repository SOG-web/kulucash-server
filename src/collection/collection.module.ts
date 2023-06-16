import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonService } from 'src/common/common.service';

@Module({
  controllers: [CollectionController],
  providers: [CollectionService, PrismaService, CommonService],
})
export class CollectionModule {}
