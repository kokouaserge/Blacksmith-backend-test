/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';

import { CoreService } from './core.service';
import { EntrepriseCreateDto } from './dto/create-entreprise.dto';

@Controller('settings')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Post()
  async placeCreate(
    @Body() body: EntrepriseCreateDto,
  ): Promise<{ success: boolean; message: string }> {
    return await this.coreService.createEntreprise(body);
  }
}
