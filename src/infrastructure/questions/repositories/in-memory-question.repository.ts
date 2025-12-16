import { Injectable } from '@nestjs/common';
import { IQuestionRepository } from '../../../domain/questions/repositories/question-repository.interface';
import { Question } from '../../../domain/questions/entities/question.entity';

@Injectable()
export class InMemoryQuestionRepository implements IQuestionRepository {
  private questions: Map<string, Question> = new Map();

  async save(question: Question): Promise<Question> {
    this.questions.set(question.id, question);
    return question;
  }

  async findById(id: string): Promise<Question | null> {
    return this.questions.get(id) || null;
  }

  async findAll(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }

  async delete(id: string): Promise<void> {
    this.questions.delete(id);
  }
}
