import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Question } from '../../../domain/questions/entities/question.entity';
import { IQuestionRepository } from '../../../domain/questions/repositories/question-repository.interface';
import { Category } from '../../../domain/questions/value-objects/category.vo';
import { QuestionContent } from '../../../domain/questions/value-objects/question-content.vo';
import { QuestionTitle } from '../../../domain/questions/value-objects/question-title.vo';
import { Visibility } from '../../../domain/questions/value-objects/visibility.vo';
import { DeleteQuestionUseCase } from './delete-question.usecase';

describe('DeleteQuestionUseCase', () => {
  let useCase: DeleteQuestionUseCase;
  let mockRepository: jest.Mocked<IQuestionRepository>;

  const createPublicQuestion = (id: string, authorId: string): Question => {
    return Question.create(
      {
        title: QuestionTitle.create('공개 질문입니다'),
        content: QuestionContent.create(
          '이것은 10자 이상의 공개 질문 내용입니다.',
        ),
        category: Category.create('JavaScript'),
        visibility: Visibility.createPublic(),
        authorId,
      },
      id,
    );
  };

  const createPrivateQuestion = (
    id: string,
    authorId: string,
    password?: string,
  ): Question => {
    return Question.create(
      {
        title: QuestionTitle.create('비공개 질문입니다'),
        content: QuestionContent.create(
          '이것은 10자 이상의 비공개 질문 내용입니다.',
        ),
        category: Category.create('React'),
        visibility: Visibility.createPrivate(password),
        authorId,
      },
      id,
    );
  };

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new DeleteQuestionUseCase(mockRepository);
  });

  describe('질문 삭제 성공', () => {
    it('작성자가 자신의 공개 질문을 삭제할 수 있다', async () => {
      // given
      const questionId = 'question-123';
      const authorId = 'author-123';
      const publicQuestion = createPublicQuestion(questionId, authorId);
      mockRepository.findById.mockResolvedValue(publicQuestion);
      mockRepository.save.mockResolvedValue(publicQuestion);

      const command = {
        id: questionId,
        authorId,
      };

      // when
      const result = await useCase.execute(command);

      // then
      expect(result.success).toBe(true);
      expect(result.deletedAt).toBeInstanceOf(Date);
      expect(mockRepository.findById).toHaveBeenCalledWith(questionId);
      expect(mockRepository.save).toHaveBeenCalledWith(publicQuestion);
      expect(publicQuestion.isDeleted).toBe(true);
    });

    it('작성자가 자신의 비공개 질문을 삭제할 수 있다', async () => {
      // given
      const questionId = 'question-456';
      const authorId = 'author-456';
      const privateQuestion = createPrivateQuestion(
        questionId,
        authorId,
        'myPassword',
      );
      mockRepository.findById.mockResolvedValue(privateQuestion);
      mockRepository.save.mockResolvedValue(privateQuestion);

      const command = {
        id: questionId,
        authorId,
      };

      // when
      const result = await useCase.execute(command);

      // then
      expect(result.success).toBe(true);
      expect(result.deletedAt).toBeInstanceOf(Date);
      expect(mockRepository.findById).toHaveBeenCalledWith(questionId);
      expect(mockRepository.save).toHaveBeenCalledWith(privateQuestion);
      expect(privateQuestion.isDeleted).toBe(true);
    });

    it('삭제 후 deletedAt이 기록된다', async () => {
      // given
      const questionId = 'question-789';
      const authorId = 'author-789';
      const publicQuestion = createPublicQuestion(questionId, authorId);
      mockRepository.findById.mockResolvedValue(publicQuestion);
      mockRepository.save.mockResolvedValue(publicQuestion);
      const beforeDelete = new Date();

      const command = {
        id: questionId,
        authorId,
      };

      // when
      const result = await useCase.execute(command);
      const afterDelete = new Date();

      // then
      expect(result.deletedAt.getTime()).toBeGreaterThanOrEqual(
        beforeDelete.getTime(),
      );
      expect(result.deletedAt.getTime()).toBeLessThanOrEqual(
        afterDelete.getTime(),
      );
      expect(publicQuestion.deletedAt).toEqual(result.deletedAt);
    });
  });

  describe('질문 삭제 실패', () => {
    it('존재하지 않는 질문 삭제 시 NotFoundException이 발생한다', async () => {
      // given
      const questionId = 'non-existent-id';
      const authorId = 'author-123';
      mockRepository.findById.mockResolvedValue(null);

      const command = {
        id: questionId,
        authorId,
      };

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(command)).rejects.toThrow(
        '질문을 찾을 수 없습니다',
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(questionId);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('이미 삭제된 질문 삭제 시 NotFoundException이 발생한다', async () => {
      // given
      const questionId = 'deleted-question-id';
      const authorId = 'author-123';
      const deletedQuestion = createPublicQuestion(questionId, authorId);
      deletedQuestion.markAsDeleted();
      mockRepository.findById.mockResolvedValue(deletedQuestion);

      const command = {
        id: questionId,
        authorId,
      };

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(command)).rejects.toThrow(
        '질문을 찾을 수 없습니다',
      );

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('작성자가 아닌 사용자가 삭제 시 ForbiddenException이 발생한다', async () => {
      // given
      const questionId = 'question-123';
      const questionAuthorId = 'author-123';
      const requestAuthorId = 'other-author-456';
      const publicQuestion = createPublicQuestion(questionId, questionAuthorId);
      mockRepository.findById.mockResolvedValue(publicQuestion);

      const command = {
        id: questionId,
        authorId: requestAuthorId,
      };

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(useCase.execute(command)).rejects.toThrow(
        '질문을 삭제할 권한이 없습니다',
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(questionId);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});
