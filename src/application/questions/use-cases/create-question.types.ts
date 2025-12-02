import { QuestionVisibility } from '../../../domain/questions/value-objects/visibility.vo';

export interface CreateQuestionCommand {
  title: string;
  content: string;
  category: string;
  visibility: QuestionVisibility;
  password?: string;
  authorId: string;
}

export interface CreateQuestionResult {
  id: string;
  title: string;
  content: string;
  category: string;
  visibility: QuestionVisibility;
  isResolved: boolean;
  likeCount: number;
  commentCount: number;
  authorId: string;
  createdAt: Date;
}
