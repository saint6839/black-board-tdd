import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IQuestionRepository } from '../../../domain/questions/repositories/question-repository.interface';
import { QUESTION_REPOSITORY } from '../../../domain/questions/repositories/question-repository.token';
import {
  DeleteQuestionCommand,
  DeleteQuestionResult,
} from './delete-question.types';

@Injectable()
export class DeleteQuestionUseCase {
  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async execute(command: DeleteQuestionCommand): Promise<DeleteQuestionResult> {
    const question = await this.questionRepository.findById(command.id);
    if (!question || question.isDeleted) {
      throw new NotFoundException('질문을 찾을 수 없습니다');
    }
    if (!question.isAuthor(command.authorId)) {
      throw new ForbiddenException('질문을 삭제할 권한이 없습니다');
    }
    question.markAsDeleted();
    await this.questionRepository.save(question);
    return {
      success: true,
      deletedAt: question.deletedAt!,
    };
  }
}
