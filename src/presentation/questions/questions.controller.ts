import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateQuestionDto } from '../../application/questions/dto/create-question.dto';
import { CreateQuestionUseCase } from '../../application/questions/use-cases/create-question.usecase';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly createQuestionUseCase: CreateQuestionUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuestion(@Body() dto: CreateQuestionDto) {
    const command: any = {
      title: dto.title,
      content: dto.content,
      category: dto.category,
      visibility: dto.visibility,
      authorId: dto.authorId,
    };

    if (dto.password !== undefined) {
      command.password = dto.password;
    }

    const question = await this.createQuestionUseCase.execute(command);

    return {
      id: question.id,
      title: question.title.value,
      content: question.content.value,
      category: question.category.value,
      visibility: question.visibility.isPublic() ? 'PUBLIC' : 'PRIVATE',
      isResolved: question.isResolved,
      likeCount: question.likeCount,
      commentCount: question.commentCount,
      authorId: question.authorId,
      createdAt: question.createdAt,
    };
  }
}
