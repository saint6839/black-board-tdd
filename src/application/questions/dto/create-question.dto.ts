import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { QuestionVisibility } from '../../../domain/questions/value-objects/visibility.vo';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: '제목은 2자 이상 50자 이하로 입력해주세요' })
  @MaxLength(50, { message: '제목은 2자 이상 50자 이하로 입력해주세요' })
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: '내용은 10자 이상 2000자 이하로 입력해주세요' })
  @MaxLength(2000, { message: '내용은 10자 이상 2000자 이하로 입력해주세요' })
  content!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['JavaScript', 'React', '테스트', '기타'], {
    message:
      '유효하지 않은 카테고리입니다. (JavaScript, React, 테스트, 기타 중 선택)',
  })
  category!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([QuestionVisibility.PUBLIC, QuestionVisibility.PRIVATE])
  visibility!: QuestionVisibility;

  @IsString()
  @IsOptional()
  password?: string;

  // 실제로는 인증된 사용자 정보에서 가져와야 하지만, 예시를 위해 DTO에 포함
  @IsString()
  @IsNotEmpty()
  authorId!: string;
}
