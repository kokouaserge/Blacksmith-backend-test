/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { EntrepriseEntity } from './entity/entreprise.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreController } from './core.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([EntrepriseEntity])],
  providers: [CoreService],
  exports: [],
  controllers: [CoreController],
})
export class CoreModule {}
