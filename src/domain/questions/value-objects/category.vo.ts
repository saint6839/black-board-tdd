type CategoryType = 'JavaScript' | 'React' | '테스트' | '기타';

export class Category {
  private static readonly VALID_CATEGORIES: CategoryType[] = [
    'JavaScript',
    'React',
    '테스트',
    '기타',
  ];

  private constructor(private readonly _value: CategoryType) {
    this.validate(_value);
  }

  static create(value: string): Category {
    return new Category(value as CategoryType);
  }

  get value(): CategoryType {
    return this._value;
  }

  private validate(value: string): void {
    if (value === null || value === undefined || value.trim() === '') {
      throw new Error('카테고리는 필수 입력 항목입니다');
    }

    if (!Category.VALID_CATEGORIES.includes(value as CategoryType)) {
      throw new Error(
        '유효하지 않은 카테고리입니다. (JavaScript, React, 테스트, 기타 중 선택)',
      );
    }
  }

  equals(other: Category): boolean {
    if (!(other instanceof Category)) {
      return false;
    }
    return this._value === other._value;
  }

  static getAllCategories(): CategoryType[] {
    return [...Category.VALID_CATEGORIES];
  }

  static isValid(value: string): boolean {
    return Category.VALID_CATEGORIES.includes(value as CategoryType);
  }
}
