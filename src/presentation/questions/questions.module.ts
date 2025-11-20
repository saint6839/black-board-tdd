import { Module } from '@nestjs/common';
import { CreateQuestionUseCase } from '../../application/questions/use-cases/create-question.usecase';
import { QUESTION_REPOSITORY } from '../../domain/questions/repositories/question-repository.token';
import { InMemoryQuestionRepository } from '../../infrastructure/questions/repositories/in-memory-question.repository';
import { QuestionsController } from './questions.controller';

@Module({
  controllers: [QuestionsController],
  providers: [
    CreateQuestionUseCase,
    {
      provide: QUESTION_REPOSITORY,
      useClass: InMemoryQuestionRepository,
    },
  ],
})
export class QuestionsModule {}
