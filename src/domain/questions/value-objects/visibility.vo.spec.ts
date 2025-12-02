import { QuestionVisibility, Visibility } from './visibility.vo';

describe('Visibility', () => {
  describe('전체 공개 설정', () => {
    it('전체 공개 설정을 생성할 수 있다', () => {
      // given & when
      const visibility = Visibility.createPublic();

      // then
      expect(visibility.isPublic()).toBe(true);
      expect(visibility.isPrivate()).toBe(false);
    });

    it('전체 공개는 비밀번호가 없다', () => {
      // given & when
      const visibility = Visibility.createPublic();

      // then
      expect(visibility.hasPassword()).toBe(false);
    });
  });

  describe('비공개 설정', () => {
    it('비밀번호와 함께 비공개 설정을 생성할 수 있다', () => {
      // given & when
      const visibility = Visibility.createPrivate('1234');

      // then
      expect(visibility.isPrivate()).toBe(true);
      expect(visibility.isPublic()).toBe(false);
      expect(visibility.hasPassword()).toBe(true);
    });

    it('비밀번호가 없으면 기본값 "0000"으로 설정된다', () => {
      // given & when
      const visibility = Visibility.createPrivate();

      // then
      expect(visibility.isPrivate()).toBe(true);
      expect(visibility.hasPassword()).toBe(true);
    });

    it('빈 문자열 비밀번호는 "0000"으로 설정된다', () => {
      // given & when
      const visibility = Visibility.createPrivate('');

      // then
      expect(visibility.isPrivate()).toBe(true);
      expect(visibility.hasPassword()).toBe(true);
    });

    it('공백 비밀번호는 "0000"으로 설정된다', () => {
      // given & when
      const visibility = Visibility.createPrivate('   ');

      // then
      expect(visibility.isPrivate()).toBe(true);
      expect(visibility.hasPassword()).toBe(true);
    });
  });

  describe('비밀번호 검증', () => {
    it('올바른 비밀번호로 검증할 수 있다', () => {
      // given
      const visibility = Visibility.createPrivate('myPassword123');

      // when & then
      expect(visibility.verifyPassword('myPassword123')).toBe(true);
    });

    it('잘못된 비밀번호는 검증에 실패한다', () => {
      // given
      const visibility = Visibility.createPrivate('correctPassword');

      // when & then
      expect(visibility.verifyPassword('wrongPassword')).toBe(false);
    });

    it('기본 비밀번호 "0000"으로 검증할 수 있다', () => {
      // given
      const visibility = Visibility.createPrivate();

      // when & then
      expect(visibility.verifyPassword('0000')).toBe(true);
    });

    it('전체 공개 설정은 항상 비밀번호 검증에 성공한다', () => {
      // given
      const visibility = Visibility.createPublic();

      // when & then
      expect(visibility.verifyPassword('anyPassword')).toBe(true);
      expect(visibility.verifyPassword('')).toBe(true);
    });
  });

  describe('Value Object 동등성', () => {
    it('같은 공개 설정을 가진 두 객체는 동등하다', () => {
      // given
      const visibility1 = Visibility.createPublic();
      const visibility2 = Visibility.createPublic();

      // when & then
      expect(visibility1.equals(visibility2)).toBe(true);
    });

    it('같은 비공개 설정과 비밀번호를 가진 두 객체는 동등하다', () => {
      // given
      const visibility1 = Visibility.createPrivate('password123');
      const visibility2 = Visibility.createPrivate('password123');

      // when & then
      expect(visibility1.equals(visibility2)).toBe(true);
    });

    it('공개/비공개가 다르면 동등하지 않다', () => {
      // given
      const visibility1 = Visibility.createPublic();
      const visibility2 = Visibility.createPrivate();

      // when & then
      expect(visibility1.equals(visibility2)).toBe(false);
    });

    it('같은 비공개이지만 비밀번호가 다르면 동등하지 않다', () => {
      // given
      const visibility1 = Visibility.createPrivate('password1');
      const visibility2 = Visibility.createPrivate('password2');

      // when & then
      expect(visibility1.equals(visibility2)).toBe(false);
    });
  });
});
