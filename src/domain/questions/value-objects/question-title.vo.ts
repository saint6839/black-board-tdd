export class QuestionTitle {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 50;

  private constructor(private readonly _value: string) {
    this.validate(_value);
  }

  static create(value: string): QuestionTitle {
    return new QuestionTitle(value);
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (value === null || value === undefined || value.trim() === '') {
      throw new Error('제목은 필수 입력 항목입니다');
    }

    const trimmedValue = value.trim();

    if (
      trimmedValue.length < QuestionTitle.MIN_LENGTH ||
      trimmedValue.length > QuestionTitle.MAX_LENGTH
    ) {
      throw new Error('제목은 2자 이상 50자 이하로 입력해주세요');
    }
  }

  equals(other: QuestionTitle): boolean {
    if (!(other instanceof QuestionTitle)) {
      return false;
    }
    return this._value === other._value;
  }
}
