import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateQuestionResult } from 'src/application/questions/use-cases/create-question.types';
import { GetQuestionResult } from 'src/application/questions/use-cases/get-question.types';
import { CreateQuestionDto } from '../../application/questions/dto/create-question.dto';
import { CreateQuestionUseCase } from '../../application/questions/use-cases/create-question.usecase';
import { GetQuestionUseCase } from '../../application/questions/use-cases/get-question.usecase';

@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly createQuestionUseCase: CreateQuestionUseCase,
    private readonly getQuestionUseCase: GetQuestionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(
    @Body() dto: CreateQuestionDto,
  ): Promise<CreateQuestionResult> {
    return await this.createQuestionUseCase.execute(dto);
  }

  @Get(':id')
  async getQuestion(
    @Param('id') id: string,
    @Query('password') password?: string,
  ): Promise<GetQuestionResult> {
    const command = password ? { id, password } : { id };
    return await this.getQuestionUseCase.execute(command);
  }
}
