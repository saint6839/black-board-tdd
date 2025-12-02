import { QuestionContent } from './question-content.vo';

describe('QuestionContent', () => {
  describe('유효한 내용 생성', () => {
    it('10자 이상 2000자 이하의 내용을 생성할 수 있다', () => {
      // given
      const validContent = '이것은 10자 이상의 유효한 질문 내용입니다.';

      // when
      const content = QuestionContent.create(validContent);

      // then
      expect(content.value).toBe(validContent);
    });

    it('10자 내용을 생성할 수 있다 (경계값)', () => {
      // given
      const tenChars = 'a'.repeat(10);

      // when
      const content = QuestionContent.create(tenChars);

      // then
      expect(content.value).toBe(tenChars);
    });

    it('2000자 내용을 생성할 수 있다 (경계값)', () => {
      // given
      const twoThousandChars = 'a'.repeat(2000);

      // when
      const content = QuestionContent.create(twoThousandChars);

      // then
      expect(content.value).toBe(twoThousandChars);
    });
  });

  describe('내용 검증 실패', () => {
    it('빈 문자열이면 예외가 발생한다', () => {
      // given & when & then
      expect(() => QuestionContent.create('')).toThrow(
        '내용은 필수 입력 항목입니다',
      );
    });

    it('null이면 예외가 발생한다', () => {
      // given & when & then
      expect(() => QuestionContent.create(null as any)).toThrow(
        '내용은 필수 입력 항목입니다',
      );
    });

    it('undefined이면 예외가 발생한다', () => {
      // given & when & then
      expect(() => QuestionContent.create(undefined as any)).toThrow(
        '내용은 필수 입력 항목입니다',
      );
    });

    it('10자 미만이면 예외가 발생한다', () => {
      // given
      const nineChars = 'a'.repeat(9);

      // when & then
      expect(() => QuestionContent.create(nineChars)).toThrow(
        '내용은 10자 이상 2000자 이하로 입력해주세요',
      );
    });

    it('2000자 초과이면 예외가 발생한다', () => {
      // given
      const twoThousandOneChars = 'a'.repeat(2001);

      // when & then
      expect(() => QuestionContent.create(twoThousandOneChars)).toThrow(
        '내용은 10자 이상 2000자 이하로 입력해주세요',
      );
    });

    it('공백만 있으면 예외가 발생한다', () => {
      // given & when & then
      expect(() => QuestionContent.create('          ')).toThrow(
        '내용은 필수 입력 항목입니다',
      );
    });
  });

  describe('Value Object 동등성', () => {
    it('같은 값을 가진 두 객체는 동등하다', () => {
      // given
      const content1 = QuestionContent.create(
        '동일한 내용입니다 동일한 내용입니다',
      );
      const content2 = QuestionContent.create(
        '동일한 내용입니다 동일한 내용입니다',
      );

      // when & then
      expect(content1.equals(content2)).toBe(true);
    });

    it('다른 값을 가진 두 객체는 동등하지 않다', () => {
      // given
      const content1 = QuestionContent.create('내용 A입니다 내용 A');
      const content2 = QuestionContent.create('내용 B입니다 내용 B');

      // when & then
      expect(content1.equals(content2)).toBe(false);
    });
  });
});
