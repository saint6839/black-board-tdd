import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateQuestionResult } from 'src/application/questions/use-cases/create-question.types';
import { CreateQuestionDto } from '../../application/questions/dto/create-question.dto';
import { CreateQuestionUseCase } from '../../application/questions/use-cases/create-question.usecase';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly createQuestionUseCase: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(
    @Body() dto: CreateQuestionDto,
  ): Promise<CreateQuestionResult> {
    return await this.createQuestionUseCase.execute(dto);
  }
}
