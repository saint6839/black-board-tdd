import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Question } from '../../../domain/questions/entities/question.entity';
import { IQuestionRepository } from '../../../domain/questions/repositories/question-repository.interface';
import { Category } from '../../../domain/questions/value-objects/category.vo';
import { QuestionContent } from '../../../domain/questions/value-objects/question-content.vo';
import { QuestionTitle } from '../../../domain/questions/value-objects/question-title.vo';
import {
  QuestionVisibility,
  Visibility,
} from '../../../domain/questions/value-objects/visibility.vo';
import { GetQuestionUseCase } from './get-question.usecase';

describe('GetQuestionUseCase', () => {
  let useCase: GetQuestionUseCase;
  let mockRepository: jest.Mocked<IQuestionRepository>;

  const createPublicQuestion = (id: string): Question => {
    return Question.create(
      {
        title: QuestionTitle.create('공개 질문입니다'),
        content: QuestionContent.create(
          '이것은 10자 이상의 공개 질문 내용입니다.',
        ),
        category: Category.create('JavaScript'),
        visibility: Visibility.createPublic(),
        authorId: 'author-123',
      },
      id,
    );
  };

  const createPrivateQuestion = (id: string, password?: string): Question => {
    return Question.create(
      {
        title: QuestionTitle.create('비공개 질문입니다'),
        content: QuestionContent.create(
          '이것은 10자 이상의 비공개 질문 내용입니다.',
        ),
        category: Category.create('React'),
        visibility: Visibility.createPrivate(password),
        authorId: 'author-456',
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

    useCase = new GetQuestionUseCase(mockRepository);
  });

  describe('질문 조회 성공', () => {
    it('공개 질문을 조회할 수 있다', async () => {
      // given
      const questionId = 'question-123';
      const publicQuestion = createPublicQuestion(questionId);
      mockRepository.findById.mockResolvedValue(publicQuestion);

      const command = {
        id: questionId,
      };

      // when
      const result = await useCase.execute(command);

      // then
      expect(result).toBeDefined();
      expect(result.id).toBe(questionId);
      expect(result.title).toBe('공개 질문입니다');
      expect(result.content).toBe('이것은 10자 이상의 공개 질문 내용입니다.');
      expect(result.category).toBe('JavaScript');
      expect(result.visibility).toBe(QuestionVisibility.PUBLIC);
      expect(result.authorId).toBe('author-123');
      expect(result.isResolved).toBe(false);
      expect(result.likeCount).toBe(0);
      expect(result.commentCount).toBe(0);
      expect(mockRepository.findById).toHaveBeenCalledWith(questionId);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('비공개 질문을 올바른 비밀번호로 조회할 수 있다', async () => {
      // given
      const questionId = 'question-456';
      const privateQuestion = createPrivateQuestion(
        questionId,
        'myPassword123',
      );
      mockRepository.findById.mockResolvedValue(privateQuestion);

      const command = {
        id: questionId,
        password: 'myPassword123',
      };

      // when
      const result = await useCase.execute(command);

      // then
      expect(result).toBeDefined();
      expect(result.id).toBe(questionId);
      expect(result.title).toBe('비공개 질문입니다');
      expect(result.content).toBe('이것은 10자 이상의 비공개 질문 내용입니다.');
      expect(result.category).toBe('React');
      expect(result.visibility).toBe(QuestionVisibility.PRIVATE);
      expect(result.authorId).toBe('author-456');
      expect(mockRepository.findById).toHaveBeenCalledWith(questionId);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('비공개 질문을 기본 비밀번호 "0000"으로 조회할 수 있다', async () => {
      // given
      const questionId = 'question-789';
      const privateQuestion = createPrivateQuestion(questionId, undefined);
      mockRepository.findById.mockResolvedValue(privateQuestion);

      const command = {
        id: questionId,
        password: '0000',
      };

      // when
      const result = await useCase.execute(command);

      // then
      expect(result).toBeDefined();
      expect(result.id).toBe(questionId);
      expect(result.visibility).toBe(QuestionVisibility.PRIVATE);
      expect(mockRepository.findById).toHaveBeenCalledWith(questionId);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('질문 조회 실패', () => {
    it('존재하지 않는 질문을 조회하면 NotFoundException이 발생한다', async () => {
      // given
      const questionId = 'non-existent-id';
      mockRepository.findById.mockResolvedValue(null);

      const command = {
        id: questionId,
      };

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(command)).rejects.toThrow(
        '질문을 찾을 수 없습니다',
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(questionId);
      expect(mockRepository.findById).toHaveBeenCalledTimes(2);
    });

    it('비공개 질문을 비밀번호 없이 조회하면 ForbiddenException이 발생한다', async () => {
      // given
      const questionId = 'question-456';
      const privateQuestion = createPrivateQuestion(
        questionId,
        'myPassword123',
      );
      mockRepository.findById.mockResolvedValue(privateQuestion);

      const command = {
        id: questionId,
      };

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(useCase.execute(command)).rejects.toThrow(
        '비공개 질문은 비밀번호가 필요합니다',
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(questionId);
    });

    it('비공개 질문을 잘못된 비밀번호로 조회하면 ForbiddenException이 발생한다', async () => {
      // given
      const questionId = 'question-456';
      const privateQuestion = createPrivateQuestion(
        questionId,
        'correctPassword',
      );
      mockRepository.findById.mockResolvedValue(privateQuestion);

      const command = {
        id: questionId,
        password: 'wrongPassword',
      };

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(useCase.execute(command)).rejects.toThrow(
        '비밀번호가 일치하지 않습니다',
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(questionId);
    });

    it('삭제된 질문을 조회하면 NotFoundException이 발생한다', async () => {
      // given
      const questionId = 'deleted-question-id';
      const deletedQuestion = createPublicQuestion(questionId);
      deletedQuestion.markAsDeleted();
      mockRepository.findById.mockResolvedValue(deletedQuestion);

      const command = {
        id: questionId,
      };

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(NotFoundException);
      await expect(useCase.execute(command)).rejects.toThrow(
        '질문을 찾을 수 없습니다',
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(questionId);
    });
  });
});
