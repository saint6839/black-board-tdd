export enum QuestionVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export class Visibility {
  private static readonly DEFAULT_PASSWORD = '0000';

  private constructor(
    private readonly _type: QuestionVisibility,
    private readonly _password?: string,
  ) {}

  static createPublic(): Visibility {
    return new Visibility(QuestionVisibility.PUBLIC);
  }

  static createPrivate(password?: string): Visibility {
    const normalizedPassword =
      !password || password.trim() === ''
        ? Visibility.DEFAULT_PASSWORD
        : password;

    return new Visibility(QuestionVisibility.PRIVATE, normalizedPassword);
  }

  isPublic(): boolean {
    return this._type === QuestionVisibility.PUBLIC;
  }

  isPrivate(): boolean {
    return this._type === QuestionVisibility.PRIVATE;
  }

  hasPassword(): boolean {
    return this.isPrivate() && !!this._password;
  }

  verifyPassword(inputPassword: string): boolean {
    // 전체 공개는 항상 검증 성공
    if (this.isPublic()) {
      return true;
    }

    // 비공개는 비밀번호 일치 여부 확인
    return this._password === inputPassword;
  }

  equals(other: Visibility): boolean {
    if (!(other instanceof Visibility)) {
      return false;
    }

    return this._type === other._type && this._password === other._password;
  }
}
