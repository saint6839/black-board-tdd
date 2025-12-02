import { QuestionTitle } from './question-title.vo';

describe('QuestionTitle', () => {
  describe('유효한 제목 생성', () => {
    it('2자 이상 50자 이하의 제목을 생성할 수 있다', () => {
      // given
      const validTitle = '이것은 유효한 질문 제목입니다';

      // when
      const title = QuestionTitle.create(validTitle);

      // then
      expect(title.value).toBe(validTitle);
    });

    it('2자 제목을 생성할 수 있다 (경계값)', () => {
      // given & when
      const title = QuestionTitle.create('제목');

      // then
      expect(title.value).toBe('제목');
    });

    it('50자 제목을 생성할 수 있다 (경계값)', () => {
      // given
      const fiftyChars = 'a'.repeat(50);

      // when
      const title = QuestionTitle.create(fiftyChars);

      // then
      expect(title.value).toBe(fiftyChars);
    });
  });

  describe('제목 검증 실패', () => {
    it('빈 문자열이면 예외가 발생한다', () => {
      // given & when & then
      expect(() => QuestionTitle.create('')).toThrow(
        '제목은 필수 입력 항목입니다',
      );
    });

    it('null이면 예외가 발생한다', () => {
      // given & when & then
      expect(() => QuestionTitle.create(null as any)).toThrow(
        '제목은 필수 입력 항목입니다',
      );
    });

    it('undefined이면 예외가 발생한다', () => {
      // given & when & then
      expect(() => QuestionTitle.create(undefined as any)).toThrow(
        '제목은 필수 입력 항목입니다',
      );
    });

    it('2자 미만이면 예외가 발생한다', () => {
      // given & when & then
      expect(() => QuestionTitle.create('제')).toThrow(
        '제목은 2자 이상 50자 이하로 입력해주세요',
      );
    });

    it('50자 초과이면 예외가 발생한다', () => {
      // given
      const fiftyOneChars = 'a'.repeat(51);

      // when & then
      expect(() => QuestionTitle.create(fiftyOneChars)).toThrow(
        '제목은 2자 이상 50자 이하로 입력해주세요',
      );
    });

    it('공백만 있으면 예외가 발생한다', () => {
      // given & when & then
      expect(() => QuestionTitle.create('   ')).toThrow(
        '제목은 필수 입력 항목입니다',
      );
    });
  });

  describe('Value Object 동등성', () => {
    it('같은 값을 가진 두 객체는 동등하다', () => {
      // given
      const title1 = QuestionTitle.create('동일한 제목');
      const title2 = QuestionTitle.create('동일한 제목');

      // when & then
      expect(title1.equals(title2)).toBe(true);
    });

    it('다른 값을 가진 두 객체는 동등하지 않다', () => {
      // given
      const title1 = QuestionTitle.create('제목 A');
      const title2 = QuestionTitle.create('제목 B');

      // when & then
      expect(title1.equals(title2)).toBe(false);
    });
  });
});
