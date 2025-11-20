import { Injectable, Inject } from '@nestjs/common';
import { IQuestionRepository } from '../../../domain/questions/repositories/question-repository.interface';
import { QUESTION_REPOSITORY } from '../../../domain/questions/repositories/question-repository.token';
import { Question } from '../../../domain/questions/entities/question.entity';
import { QuestionTitle } from '../../../domain/questions/value-objects/question-title.vo';
import { QuestionContent } from '../../../domain/questions/value-objects/question-content.vo';
import { Category } from '../../../domain/questions/value-objects/category.vo';
import { Visibility } from '../../../domain/questions/value-objects/visibility.vo';

export interface CreateQuestionCommand {
  title: string;
  content: string;
  category: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  password?: string;
  authorId: string;
}

@Injectable()
export class CreateQuestionUseCase {
  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async execute(command: CreateQuestionCommand): Promise<Question> {
    // Value Objects 생성 (도메인 검증 수행)
    const title = QuestionTitle.create(command.title);
    const content = QuestionContent.create(command.content);
    const category = Category.create(command.category);
    const visibility =
      command.visibility === 'PUBLIC'
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
    return await this.questionRepository.save(question);
  }
}
