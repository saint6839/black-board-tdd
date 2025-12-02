import { Inject, Injectable } from '@nestjs/common';
import { Question } from '../../../domain/questions/entities/question.entity';
import { IQuestionRepository } from '../../../domain/questions/repositories/question-repository.interface';
import { QUESTION_REPOSITORY } from '../../../domain/questions/repositories/question-repository.token';
import { Category } from '../../../domain/questions/value-objects/category.vo';
import { QuestionContent } from '../../../domain/questions/value-objects/question-content.vo';
import { QuestionTitle } from '../../../domain/questions/value-objects/question-title.vo';
import {
  QuestionVisibility,
  Visibility,
} from '../../../domain/questions/value-objects/visibility.vo';
import {
  CreateQuestionCommand,
  CreateQuestionResult,
} from './create-question.types';

@Injectable()
export class CreateQuestionUseCase {
  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async execute(command: CreateQuestionCommand): Promise<CreateQuestionResult> {
    // Value Objects 생성 (도메인 검증 수행)
    const title = QuestionTitle.create(command.title);
    const content = QuestionContent.create(command.content);
    const category = Category.create(command.category);
    const visibility =
      command.visibility === QuestionVisibility.PUBLIC
        ? Visibility.createPublic()
        : Visibility.createPrivate(command.password);

    // Question Entity 생성
    const question = Question.create({
      title,
      content,
      category,
      visibility,
      authorId: command.authorId,
    });

    // Repository를 통해 저장
    const savedQuestion = await this.questionRepository.save(question);

    // 응답 데이터 매핑 (Entity -> Result)
    return {
      id: savedQuestion.id,
      title: savedQuestion.title.value,
      content: savedQuestion.content.value,
      category: savedQuestion.category.value,
      visibility: savedQuestion.visibility.isPublic()
        ? QuestionVisibility.PUBLIC
        : QuestionVisibility.PRIVATE,
      isResolved: savedQuestion.isResolved,
      likeCount: savedQuestion.likeCount,
      commentCount: savedQuestion.commentCount,
      authorId: savedQuestion.authorId,
      createdAt: savedQuestion.createdAt,
    };
  }
}
