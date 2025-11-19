import { Question } from '../entities/question.entity';

export interface IQuestionRepository {
  save(question: Question): Promise<Question>;
  findById(id: string): Promise<Question | null>;
  findAll(): Promise<Question[]>;
  delete(id: string): Promise<void>;
}
