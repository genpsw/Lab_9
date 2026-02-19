export interface Book {
  bookNo: number;
  bookName: string;
}

export type DbShape = { books: Book[] };
