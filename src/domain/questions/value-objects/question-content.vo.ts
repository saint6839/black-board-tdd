export class QuestionContent {
  private static readonly MIN_LENGTH = 10;
  private static readonly MAX_LENGTH = 2000;

  private constructor(private readonly _value: string) {
    this.validate(_value);
  }

  static create(value: string): QuestionContent {
    return new QuestionContent(value);
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (value === null || value === undefined || value.trim() === '') {
      throw new Error('내용은 필수 입력 항목입니다');
    }

    const trimmedValue = value.trim();

    if (
      trimmedValue.length < QuestionContent.MIN_LENGTH ||
      trimmedValue.length > QuestionContent.MAX_LENGTH
    ) {
      throw new Error('내용은 10자 이상 2000자 이하로 입력해주세요');
    }
  }

  equals(other: QuestionContent): boolean {
    if (!(other instanceof QuestionContent)) {
      return false;
    }
    return this._value === other._value;
  }
}
