import { Category } from '../value-objects/category.vo';
import { QuestionContent } from '../value-objects/question-content.vo';
import { QuestionTitle } from '../value-objects/question-title.vo';
import { Visibility } from '../value-objects/visibility.vo';
import { Question } from './question.entity';

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
      // given & when
      const question = createValidQuestion();

      // then
      expect(question.title.value).toBe('NestJS 질문입니다');
      expect(question.content.value).toBe(
        '이것은 10자 이상의 질문 내용입니다.',
      );
      expect(question.category.value).toBe('JavaScript');
      expect(question.visibility.isPublic()).toBe(true);
      expect(question.authorId).toBe('author-123');
    });

    it('생성 시 ID가 자동으로 부여된다', () => {
      // given & when
      const question = createValidQuestion();

      // then
      expect(question.id).toBeDefined();
      expect(typeof question.id).toBe('string');
      expect(question.id.length).toBeGreaterThan(0);
    });

    it('생성 시 해결 여부는 false로 초기화된다', () => {
      // given & when
      const question = createValidQuestion();

      // then
      expect(question.isResolved).toBe(false);
    });

    it('생성 시 좋아요 수는 0으로 초기화된다', () => {
      // given & when
      const question = createValidQuestion();

      // then
      expect(question.likeCount).toBe(0);
    });

    it('생성 시 댓글 수는 0으로 초기화된다', () => {
      // given & when
      const question = createValidQuestion();

      // then
      expect(question.commentCount).toBe(0);
    });

    it('생성 시 삭제 여부는 false로 초기화된다', () => {
      // given & when
      const question = createValidQuestion();

      // then
      expect(question.isDeleted).toBe(false);
    });

    it('생성 시 삭제 시간은 null로 초기화된다', () => {
      // given & when
      const question = createValidQuestion();

      // then
      expect(question.deletedAt).toBeNull();
    });

    it('생성 시간이 자동으로 기록된다', () => {
      // given
      const beforeCreate = new Date();

      // when
      const question = createValidQuestion();
      const afterCreate = new Date();

      // then
      expect(question.createdAt).toBeInstanceOf(Date);
      expect(question.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime(),
      );
      expect(question.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime(),
      );
    });

    it('비공개 질문을 생성할 수 있다', () => {
      // given & when
      const question = Question.create({
        title: QuestionTitle.create('비공개 질문입니다'),
        content: QuestionContent.create('이것은 비공개 질문 내용입니다.'),
        category: Category.create('React'),
        visibility: Visibility.createPrivate('myPassword'),
        authorId: 'author-456',
      });

      // then
      expect(question.visibility.isPrivate()).toBe(true);
    });
  });

  describe('해결 여부 변경', () => {
    it('해결 여부를 true로 변경할 수 있다', () => {
      // given
      const question = createValidQuestion();

      // when
      question.markAsResolved();

      // then
      expect(question.isResolved).toBe(true);
    });

    it('해결 여부를 false로 변경할 수 있다', () => {
      // given
      const question = createValidQuestion();
      question.markAsResolved();

      // when
      question.markAsUnresolved();

      // then
      expect(question.isResolved).toBe(false);
    });

    it('해결 여부를 토글할 수 있다', () => {
      // given
      const question = createValidQuestion();

      // when
      question.toggleResolved();

      // then
      expect(question.isResolved).toBe(true);

      // when
      question.toggleResolved();

      // then
      expect(question.isResolved).toBe(false);
    });
  });

  describe('좋아요 기능', () => {
    it('좋아요 수를 증가시킬 수 있다', () => {
      // given
      const question = createValidQuestion();

      // when
      question.incrementLike();

      // then
      expect(question.likeCount).toBe(1);
    });

    it('좋아요 수를 감소시킬 수 있다', () => {
      // given
      const question = createValidQuestion();
      question.incrementLike();

      // when
      question.decrementLike();

      // then
      expect(question.likeCount).toBe(0);
    });

    it('좋아요 수가 0 미만으로 감소하지 않는다', () => {
      // given
      const question = createValidQuestion();

      // when
      question.decrementLike();

      // then
      expect(question.likeCount).toBe(0);
    });

    it('여러 번 좋아요를 증가시킬 수 있다', () => {
      // given
      const question = createValidQuestion();

      // when
      question.incrementLike();
      question.incrementLike();
      question.incrementLike();

      // then
      expect(question.likeCount).toBe(3);
    });
  });

  describe('댓글 수 관리', () => {
    it('댓글 수를 증가시킬 수 있다', () => {
      // given
      const question = createValidQuestion();

      // when
      question.incrementCommentCount();

      // then
      expect(question.commentCount).toBe(1);
    });

    it('댓글 수를 감소시킬 수 있다', () => {
      // given
      const question = createValidQuestion();
      question.incrementCommentCount();

      // when
      question.decrementCommentCount();

      // then
      expect(question.commentCount).toBe(0);
    });

    it('댓글 수가 0 미만으로 감소하지 않는다', () => {
      // given
      const question = createValidQuestion();

      // when
      question.decrementCommentCount();

      // then
      expect(question.commentCount).toBe(0);
    });
  });

  describe('작성자 확인', () => {
    it('작성자가 맞는지 확인할 수 있다', () => {
      // given
      const question = createValidQuestion();

      // when & then
      expect(question.isAuthor('author-123')).toBe(true);
      expect(question.isAuthor('other-author')).toBe(false);
    });
  });

  describe('비공개 질문 접근', () => {
    it('전체 공개 질문은 비밀번호 없이 접근 가능하다', () => {
      // given
      const question = createValidQuestion();

      // when & then
      expect(question.canAccess()).toBe(true);
    });

    it('비공개 질문은 비밀번호 없이 접근 불가능하다', () => {
      // given
      const question = Question.create({
        title: QuestionTitle.create('비공개 질문입니다'),
        content: QuestionContent.create('이것은 비공개 질문 내용입니다.'),
        category: Category.create('React'),
        visibility: Visibility.createPrivate('secret123'),
        authorId: 'author-456',
      });

      // when & then
      expect(question.canAccess()).toBe(false);
    });

    it('비공개 질문은 올바른 비밀번호로 접근 가능하다', () => {
      // given
      const question = Question.create({
        title: QuestionTitle.create('비공개 질문입니다'),
        content: QuestionContent.create('이것은 비공개 질문 내용입니다.'),
        category: Category.create('React'),
        visibility: Visibility.createPrivate('secret123'),
        authorId: 'author-456',
      });

      // when & then
      expect(question.canAccess('secret123')).toBe(true);
    });

    it('비공개 질문은 잘못된 비밀번호로 접근 불가능하다', () => {
      // given
      const question = Question.create({
        title: QuestionTitle.create('비공개 질문입니다'),
        content: QuestionContent.create('이것은 비공개 질문 내용입니다.'),
        category: Category.create('React'),
        visibility: Visibility.createPrivate('secret123'),
        authorId: 'author-456',
      });

      // when & then
      expect(question.canAccess('wrongPassword')).toBe(false);
    });
  });

  describe('소프트 삭제', () => {
    it('질문을 소프트 삭제할 수 있다', () => {
      // given
      const question = createValidQuestion();

      // when
      question.markAsDeleted();

      // then
      expect(question.isDeleted).toBe(true);
    });

    it('소프트 삭제 시 삭제 시간이 기록된다', () => {
      // given
      const question = createValidQuestion();
      const beforeDelete = new Date();

      // when
      question.markAsDeleted();
      const afterDelete = new Date();

      // then
      expect(question.deletedAt).toBeInstanceOf(Date);
      expect(question.deletedAt!.getTime()).toBeGreaterThanOrEqual(
        beforeDelete.getTime(),
      );
      expect(question.deletedAt!.getTime()).toBeLessThanOrEqual(
        afterDelete.getTime(),
      );
    });
  });
});
