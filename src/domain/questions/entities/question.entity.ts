import { randomUUID } from 'crypto';
import { Category } from '../value-objects/category.vo';
import { QuestionContent } from '../value-objects/question-content.vo';
import { QuestionTitle } from '../value-objects/question-title.vo';
import { Visibility } from '../value-objects/visibility.vo';

interface QuestionProps {
  title: QuestionTitle;
  content: QuestionContent;
  category: Category;
  visibility: Visibility;
  authorId: string;
}

export class Question {
  private readonly _id: string;
  private readonly _title: QuestionTitle;
  private readonly _content: QuestionContent;
  private readonly _category: Category;
  private readonly _visibility: Visibility;
  private readonly _authorId: string;
  private _isResolved: boolean;
  private _likeCount: number;
  private _commentCount: number;
  private readonly _createdAt: Date;
  private _isDeleted: boolean;
  private _deletedAt: Date | null;

  private constructor(props: QuestionProps, id?: string) {
    this._id = id ?? randomUUID();
    this._title = props.title;
    this._content = props.content;
    this._category = props.category;
    this._visibility = props.visibility;
    this._authorId = props.authorId;
    this._isResolved = false;
    this._likeCount = 0;
    this._commentCount = 0;
    this._createdAt = new Date();
    this._isDeleted = false;
    this._deletedAt = null;
  }

  static create(props: QuestionProps, id?: string): Question {
    return new Question(props, id);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get title(): QuestionTitle {
    return this._title;
  }

  get content(): QuestionContent {
    return this._content;
  }

  get category(): Category {
    return this._category;
  }

  get visibility(): Visibility {
    return this._visibility;
  }

  get authorId(): string {
    return this._authorId;
  }

  get isResolved(): boolean {
    return this._isResolved;
  }

  get likeCount(): number {
    return this._likeCount;
  }

  get commentCount(): number {
    return this._commentCount;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  // 해결 여부 관리
  markAsResolved(): void {
    this._isResolved = true;
  }

  markAsUnresolved(): void {
    this._isResolved = false;
  }

  toggleResolved(): void {
    this._isResolved = !this._isResolved;
  }

  // 좋아요 관리
  incrementLike(): void {
    this._likeCount++;
  }

  decrementLike(): void {
    if (this._likeCount > 0) {
      this._likeCount--;
    }
  }

  // 댓글 수 관리
  incrementCommentCount(): void {
    this._commentCount++;
  }

  decrementCommentCount(): void {
    if (this._commentCount > 0) {
      this._commentCount--;
    }
  }

  // 작성자 확인
  isAuthor(userId: string): boolean {
    return this._authorId === userId;
  }

  // 접근 권한 확인
  canAccess(password?: string): boolean {
    return this._visibility.verifyPassword(password ?? '');
  }

  // 소프트 삭제
  markAsDeleted(): void {
    this._isDeleted = true;
    this._deletedAt = new Date();
  }
}
