import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IQuestionRepository } from '../../../domain/questions/repositories/question-repository.interface';
import { QUESTION_REPOSITORY } from '../../../domain/questions/repositories/question-repository.token';
import { QuestionVisibility } from '../../../domain/questions/value-objects/visibility.vo';
import { GetQuestionCommand, GetQuestionResult } from './get-question.types';

@Injectable()
export class GetQuestionUseCase {
  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async execute(command: GetQuestionCommand): Promise<GetQuestionResult> {
    // Repository에서 질문 조회
    const question = await this.questionRepository.findById(command.id);

    // 질문이 없거나 삭제된 질문이면 예외 발생
    if (!question || question.isDeleted) {
      throw new NotFoundException('질문을 찾을 수 없습니다');
    }

    // 비공개 질문인 경우 비밀번호 검증
    if (question.visibility.isPrivate()) {
      if (!command.password) {
        throw new ForbiddenException('비공개 질문은 비밀번호가 필요합니다');
      }

      if (!question.canAccess(command.password)) {
        throw new ForbiddenException('비밀번호가 일치하지 않습니다');
      }
    }

    // 응답 데이터 매핑 (Entity -> Result)
    return {
      id: question.id,
      title: question.title.value,
      content: question.content.value,
      category: question.category.value,
      visibility: question.visibility.isPublic()
        ? QuestionVisibility.PUBLIC
        : QuestionVisibility.PRIVATE,
      isResolved: question.isResolved,
      likeCount: question.likeCount,
      commentCount: question.commentCount,
      authorId: question.authorId,
      createdAt: question.createdAt,
    };
  }
}
