import { Module } from '@nestjs/common';
import { CreateQuestionUseCase } from '../../application/questions/use-cases/create-question.usecase';
import { DeleteQuestionUseCase } from '../../application/questions/use-cases/delete-question.usecase';
import { GetQuestionUseCase } from '../../application/questions/use-cases/get-question.usecase';
import { QUESTION_REPOSITORY } from '../../domain/questions/repositories/question-repository.token';
import { InMemoryQuestionRepository } from '../../infrastructure/questions/repositories/in-memory-question.repository';
import { QuestionsController } from './questions.controller';

@Module({
  controllers: [QuestionsController],
  providers: [
    CreateQuestionUseCase,
    DeleteQuestionUseCase,
    GetQuestionUseCase,
    {
      provide: QUESTION_REPOSITORY,
      useClass: InMemoryQuestionRepository,
    },
  ],
})
export class QuestionsModule {}
