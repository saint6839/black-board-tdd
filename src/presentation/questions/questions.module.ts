import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { CreateQuestionUseCase } from '../../application/questions/use-cases/create-question.usecase';

// Repository는 실제 구현이 필요하지만, 예시를 위해 Provider로만 정의
// 실제로는 Infrastructure Layer에서 구현해야 함
const QUESTION_REPOSITORY = 'IQuestionRepository';

@Module({
  controllers: [QuestionsController],
  providers: [
    CreateQuestionUseCase,
    // 실제 구현 시 Infrastructure Layer의 Repository 구현체를 여기에 바인딩
    // {
    //   provide: QUESTION_REPOSITORY,
    //   useClass: QuestionRepositoryImpl,
    // },
  ],
})
export class QuestionsModule {}
