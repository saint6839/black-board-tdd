import { Question } from './question.entity';
import { QuestionTitle } from '../value-objects/question-title.vo';
import { QuestionContent } from '../value-objects/question-content.vo';
import { Category } from '../value-objects/category.vo';
import { Visibility } from '../value-objects/visibility.vo';

describe('Question Entity', () => {
  const createValidQuestion = () => {
    return Question.create({
      title: QuestionTitle.create('NestJS 질문입니다'),
      content: QuestionContent.create('이것은 10자 이상의 질문 내용입니다.'),
      category: Category.create('JavaScript'),
      visibility: Visibility.createPublic(),
      authorId: 'author-123',
    });
  };

  describe('질문 생성', () => {
    it('유효한 값으로 질문을 생성할 수 있다', () => {
      const question = createValidQuestion();

      expect(question.title.value).toBe('NestJS 질문입니다');
      expect(question.content.value).toBe('이것은 10자 이상의 질문 내용입니다.');
      expect(question.category.value).toBe('JavaScript');
      expect(question.visibility.isPublic()).toBe(true);
      expect(question.authorId).toBe('author-123');
    });

    it('생성 시 ID가 자동으로 부여된다', () => {
      const question = createValidQuestion();

      expect(question.id).toBeDefined();
      expect(typeof question.id).toBe('string');
      expect(question.id.length).toBeGreaterThan(0);
    });

    it('생성 시 해결 여부는 false로 초기화된다', () => {
      const question = createValidQuestion();

      expect(question.isResolved).toBe(false);
    });

    it('생성 시 좋아요 수는 0으로 초기화된다', () => {
      const question = createValidQuestion();

      expect(question.likeCount).toBe(0);
    });

    it('생성 시 댓글 수는 0으로 초기화된다', () => {
      const question = createValidQuestion();

      expect(question.commentCount).toBe(0);
    });

    it('생성 시간이 자동으로 기록된다', () => {
      const beforeCreate = new Date();
      const question = createValidQuestion();
      const afterCreate = new Date();

      expect(question.createdAt).toBeInstanceOf(Date);
      expect(question.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime(),
      );
      expect(question.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime(),
      );
    });

    it('비공개 질문을 생성할 수 있다', () => {
      const question = Question.create({
        title: QuestionTitle.create('비공개 질문입니다'),
        content: QuestionContent.create('이것은 비공개 질문 내용입니다.'),
        category: Category.create('React'),
        visibility: Visibility.createPrivate('myPassword'),
        authorId: 'author-456',
      });

      expect(question.visibility.isPrivate()).toBe(true);
    });
  });

  describe('해결 여부 변경', () => {
    it('해결 여부를 true로 변경할 수 있다', () => {
      const question = createValidQuestion();

      question.markAsResolved();

      expect(question.isResolved).toBe(true);
    });

    it('해결 여부를 false로 변경할 수 있다', () => {
      const question = createValidQuestion();
      question.markAsResolved();

      question.markAsUnresolved();

      expect(question.isResolved).toBe(false);
    });

    it('해결 여부를 토글할 수 있다', () => {
      const question = createValidQuestion();

      question.toggleResolved();
      expect(question.isResolved).toBe(true);

      question.toggleResolved();
      expect(question.isResolved).toBe(false);
    });
  });

  describe('좋아요 기능', () => {
    it('좋아요 수를 증가시킬 수 있다', () => {
      const question = createValidQuestion();

      question.incrementLike();

      expect(question.likeCount).toBe(1);
    });

    it('좋아요 수를 감소시킬 수 있다', () => {
      const question = createValidQuestion();
      question.incrementLike();

      question.decrementLike();

      expect(question.likeCount).toBe(0);
    });

    it('좋아요 수가 0 미만으로 감소하지 않는다', () => {
      const question = createValidQuestion();

      question.decrementLike();

      expect(question.likeCount).toBe(0);
    });

    it('여러 번 좋아요를 증가시킬 수 있다', () => {
      const question = createValidQuestion();

      question.incrementLike();
      question.incrementLike();
      question.incrementLike();

      expect(question.likeCount).toBe(3);
    });
  });

  describe('댓글 수 관리', () => {
    it('댓글 수를 증가시킬 수 있다', () => {
      const question = createValidQuestion();

      question.incrementCommentCount();

      expect(question.commentCount).toBe(1);
    });

    it('댓글 수를 감소시킬 수 있다', () => {
      const question = createValidQuestion();
      question.incrementCommentCount();

      question.decrementCommentCount();

      expect(question.commentCount).toBe(0);
    });

    it('댓글 수가 0 미만으로 감소하지 않는다', () => {
      const question = createValidQuestion();

      question.decrementCommentCount();

      expect(question.commentCount).toBe(0);
    });
  });

  describe('작성자 확인', () => {
    it('작성자가 맞는지 확인할 수 있다', () => {
      const question = createValidQuestion();

      expect(question.isAuthor('author-123')).toBe(true);
      expect(question.isAuthor('other-author')).toBe(false);
    });
  });

  describe('비공개 질문 접근', () => {
    it('전체 공개 질문은 비밀번호 없이 접근 가능하다', () => {
      const question = createValidQuestion();

      expect(question.canAccess()).toBe(true);
    });

    it('비공개 질문은 비밀번호 없이 접근 불가능하다', () => {
      const question = Question.create({
        title: QuestionTitle.create('비공개 질문입니다'),
        content: QuestionContent.create('이것은 비공개 질문 내용입니다.'),
        category: Category.create('React'),
        visibility: Visibility.createPrivate('secret123'),
        authorId: 'author-456',
      });

      expect(question.canAccess()).toBe(false);
    });

    it('비공개 질문은 올바른 비밀번호로 접근 가능하다', () => {
      const question = Question.create({
        title: QuestionTitle.create('비공개 질문입니다'),
        content: QuestionContent.create('이것은 비공개 질문 내용입니다.'),
        category: Category.create('React'),
        visibility: Visibility.createPrivate('secret123'),
        authorId: 'author-456',
      });

      expect(question.canAccess('secret123')).toBe(true);
    });

    it('비공개 질문은 잘못된 비밀번호로 접근 불가능하다', () => {
      const question = Question.create({
        title: QuestionTitle.create('비공개 질문입니다'),
        content: QuestionContent.create('이것은 비공개 질문 내용입니다.'),
        category: Category.create('React'),
        visibility: Visibility.createPrivate('secret123'),
        authorId: 'author-456',
      });

      expect(question.canAccess('wrongPassword')).toBe(false);
    });
  });
});
