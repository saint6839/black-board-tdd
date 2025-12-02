import { Question } from '../../../domain/questions/entities/question.entity';
import { IQuestionRepository } from '../../../domain/questions/repositories/question-repository.interface';
import { QuestionVisibility } from '../../../domain/questions/value-objects/visibility.vo';
import { CreateQuestionUseCase } from './create-question.usecase';

describe('CreateQuestionUseCase', () => {
  let useCase: CreateQuestionUseCase;
  let mockRepository: jest.Mocked<IQuestionRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateQuestionUseCase(mockRepository);
  });

  describe('질문 생성 성공', () => {
    it('유효한 입력으로 질문을 생성할 수 있다', async () => {
      // given
      const command = {
        title: 'NestJS에서 의존성 주입은 어떻게 하나요?',
        content:
          '생성자 주입과 속성 주입의 차이점이 궁금합니다. 자세히 알려주세요.',
        category: 'JavaScript',
        visibility: QuestionVisibility.PUBLIC,
        authorId: 'user-123',
      };

      mockRepository.save.mockImplementation(async (question: Question) => {
        return question;
      });

      // when
      const result = await useCase.execute(command);

      // then
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.title).toBe(command.title);
      expect(result.content).toBe(command.content);
      expect(result.category).toBe(command.category);
      expect(result.visibility).toBe(QuestionVisibility.PUBLIC);
      expect(result.authorId).toBe(command.authorId);
      expect(result.isResolved).toBe(false);
      expect(result.likeCount).toBe(0);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('비공개 질문을 생성할 수 있다', async () => {
      // given
      const command = {
        title: '비공개 질문입니다',
        content: '이것은 10자 이상의 비공개 질문 내용입니다.',
        category: 'React',
        visibility: QuestionVisibility.PRIVATE,
        password: 'mySecret123',
        authorId: 'user-456',
      };

      mockRepository.save.mockImplementation(async (question: Question) => {
        return question;
      });

      // when
      const result = await useCase.execute(command);

      // then
      expect(result.visibility).toBe(QuestionVisibility.PRIVATE);

      const savedQuestion = mockRepository.save.mock.calls[0]?.[0];
      expect(savedQuestion).toBeDefined();
      if (savedQuestion) {
        expect(savedQuestion.visibility.isPrivate()).toBe(true);
        expect(savedQuestion.visibility.verifyPassword('mySecret123')).toBe(
          true,
        );
      }
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('비공개 질문에 비밀번호가 없으면 기본값 "0000"으로 설정된다', async () => {
      // given
      const command = {
        title: '비공개 질문입니다',
        content: '이것은 10자 이상의 비공개 질문 내용입니다.',
        category: 'React',
        visibility: QuestionVisibility.PRIVATE,
        authorId: 'user-789',
      };

      mockRepository.save.mockImplementation(async (question: Question) => {
        return question;
      });

      // when
      const result = await useCase.execute(command);

      // then
      expect(result.visibility).toBe(QuestionVisibility.PRIVATE);

      const savedQuestion = mockRepository.save.mock.calls[0]?.[0];
      expect(savedQuestion).toBeDefined();
      if (savedQuestion) {
        expect(savedQuestion.visibility.isPrivate()).toBe(true);
        expect(savedQuestion.visibility.verifyPassword('0000')).toBe(true);
      }
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('질문 생성 실패 - 제목 검증', () => {
    it('제목이 2자 미만이면 예외가 발생한다', async () => {
      // given
      const command = {
        title: '제',
        content: '이것은 10자 이상의 질문 내용입니다.',
        category: 'JavaScript',
        visibility: QuestionVisibility.PUBLIC,
        authorId: 'user-123',
      };

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(
        '제목은 2자 이상 50자 이하로 입력해주세요',
      );

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('제목이 50자 초과이면 예외가 발생한다', async () => {
      // given
      const command = {
        title: 'a'.repeat(51),
        content: '이것은 10자 이상의 질문 내용입니다.',
        category: 'JavaScript',
        visibility: QuestionVisibility.PUBLIC,
        authorId: 'user-123',
      };

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(
        '제목은 2자 이상 50자 이하로 입력해주세요',
      );

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('제목이 빈 문자열이면 예외가 발생한다', async () => {
      // given
      const command = {
        title: '',
        content: '이것은 10자 이상의 질문 내용입니다.',
        category: 'JavaScript',
        visibility: QuestionVisibility.PUBLIC,
        authorId: 'user-123',
      };

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(
        '제목은 필수 입력 항목입니다',
      );

      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('질문 생성 실패 - 내용 검증', () => {
    it('내용이 10자 미만이면 예외가 발생한다', async () => {
      // given
      const command = {
        title: '유효한 제목입니다',
        content: '짧은내용',
        category: 'JavaScript',
        visibility: QuestionVisibility.PUBLIC,
        authorId: 'user-123',
      };

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(
        '내용은 10자 이상 2000자 이하로 입력해주세요',
      );

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('내용이 2000자 초과이면 예외가 발생한다', async () => {
      // given
      const command = {
        title: '유효한 제목입니다',
        content: 'a'.repeat(2001),
        category: 'JavaScript',
        visibility: QuestionVisibility.PUBLIC,
        authorId: 'user-123',
      };

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(
        '내용은 10자 이상 2000자 이하로 입력해주세요',
      );

      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('질문 생성 실패 - 카테고리 검증', () => {
    it('유효하지 않은 카테고리면 예외가 발생한다', async () => {
      // given
      const command = {
        title: '유효한 제목입니다',
        content: '이것은 10자 이상의 질문 내용입니다.',
        category: 'InvalidCategory',
        visibility: QuestionVisibility.PUBLIC,
        authorId: 'user-123',
      };

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(
        '유효하지 않은 카테고리입니다',
      );

      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('Repository 실패 처리', () => {
    it('Repository save 실패 시 예외를 전파한다', async () => {
      // given
      const command = {
        title: 'NestJS 질문입니다',
        content: '이것은 10자 이상의 질문 내용입니다.',
        category: 'JavaScript',
        visibility: QuestionVisibility.PUBLIC,
        authorId: 'user-123',
      };

      mockRepository.save.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // when & then
      await expect(useCase.execute(command)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
