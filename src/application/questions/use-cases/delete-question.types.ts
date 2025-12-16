export interface DeleteQuestionCommand {
  id: string;
  authorId: string;
}

export interface DeleteQuestionResult {
  success: boolean;
  deletedAt: Date;
}
