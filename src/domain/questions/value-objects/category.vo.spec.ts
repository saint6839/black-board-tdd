import { Category } from './category.vo';

describe('Category', () => {
  describe('유효한 카테고리 생성', () => {
    it('JavaScript 카테고리를 생성할 수 있다', () => {
      // given & when
      const category = Category.create('JavaScript');

      // then
      expect(category.value).toBe('JavaScript');
    });

    it('React 카테고리를 생성할 수 있다', () => {
      // given & when
      const category = Category.create('React');

      // then
      expect(category.value).toBe('React');
    });

    it('테스트 카테고리를 생성할 수 있다', () => {
      // given & when
      const category = Category.create('테스트');

      // then
      expect(category.value).toBe('테스트');
    });

    it('기타 카테고리를 생성할 수 있다', () => {
      // given & when
      const category = Category.create('기타');

      // then
      expect(category.value).toBe('기타');
    });
  });

  describe('카테고리 검증 실패', () => {
    it('빈 문자열이면 예외가 발생한다', () => {
      // given & when & then
      expect(() => Category.create('')).toThrow(
        '카테고리는 필수 입력 항목입니다',
      );
    });

    it('null이면 예외가 발생한다', () => {
      // given & when & then
      expect(() => Category.create(null as any)).toThrow(
        '카테고리는 필수 입력 항목입니다',
      );
    });

    it('undefined이면 예외가 발생한다', () => {
      // given & when & then
      expect(() => Category.create(undefined as any)).toThrow(
        '카테고리는 필수 입력 항목입니다',
      );
    });

    it('유효하지 않은 카테고리면 예외가 발생한다', () => {
      // given & when & then
      expect(() => Category.create('InvalidCategory')).toThrow(
        '유효하지 않은 카테고리입니다. (JavaScript, React, 테스트, 기타 중 선택)',
      );
    });

    it('대소문자를 구분한다 (javascript는 유효하지 않음)', () => {
      // given & when & then
      expect(() => Category.create('javascript')).toThrow(
        '유효하지 않은 카테고리입니다. (JavaScript, React, 테스트, 기타 중 선택)',
      );
    });
  });

  describe('Value Object 동등성', () => {
    it('같은 카테고리를 가진 두 객체는 동등하다', () => {
      // given
      const category1 = Category.create('JavaScript');
      const category2 = Category.create('JavaScript');

      // when & then
      expect(category1.equals(category2)).toBe(true);
    });

    it('다른 카테고리를 가진 두 객체는 동등하지 않다', () => {
      // given
      const category1 = Category.create('JavaScript');
      const category2 = Category.create('React');

      // when & then
      expect(category1.equals(category2)).toBe(false);
    });
  });

  describe('유틸리티 메서드', () => {
    it('모든 유효한 카테고리 목록을 반환한다', () => {
      // given & when
      const categories = Category.getAllCategories();

      // then
      expect(categories).toEqual(['JavaScript', 'React', '테스트', '기타']);
    });

    it('문자열이 유효한 카테고리인지 확인할 수 있다', () => {
      // given & when & then
      expect(Category.isValid('JavaScript')).toBe(true);
      expect(Category.isValid('React')).toBe(true);
      expect(Category.isValid('InvalidCategory')).toBe(false);
    });
  });
});
