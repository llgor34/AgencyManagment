import { Board } from './Board.model';

export interface ProjectTemplate {
  uid?: string;
  title: string;
  board: Board;
}
