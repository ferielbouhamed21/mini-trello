export interface Board {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  _id: string;
  boardId: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  _id: string;
  listId: string;
  boardId: string;
  title: string;
  description?: string;
  dueDate?: string;
  labels: string[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardDto {
  title: string;
  description?: string;
}

export interface CreateListDto {
  title: string;
  position: number;
}

export interface CreateCardDto {
  title: string;
  description?: string;
  dueDate?: string;
  labels?: string[];
  position: number;
}

export interface MoveCardDto {
  listId: string;
  boardId: string;
  position: number;
}
