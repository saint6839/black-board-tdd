import { QuestionVisibility } from '../../../domain/questions/value-objects/visibility.vo';

export interface GetQuestionCommand {
  id: string;
  password?: string;
}

export interface GetQuestionResult {
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
