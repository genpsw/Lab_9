import fs from "fs";
import path from "path";

export type Book = {
  bookNo: number;
  bookName: string;
};

type DbShape = { books: Book[] };

const dbPath = path.join(process.cwd(), "data", "books.json");

// TODO 1: Implement readDb(): DbShape
function readDb(): DbShape {
  // 1. Check if folder exists, if not create it
  const dirPath = path.dirname(dbPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // 2. Check if file exists, if not create it with initial data
  if (!fs.existsSync(dbPath)) {
    const initialData: DbShape = { books: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  // 3. Read and parse
  const fileContent = fs.readFileSync(dbPath, "utf-8");
  if (!fileContent.trim()) {
    return { books: [] }; // Handle empty file case safely
  }
  return JSON.parse(fileContent) as DbShape;
}

// TODO 2: Implement writeDb(db: DbShape)
function writeDb(db: DbShape) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
}

export function readBooks(): Book[] {
  // TODO 3: return readDb().books
  const db = readDb();
  return db.books;
}

export function addBook(bookName: string): Book {
  if (!bookName || bookName.trim() === "") {
    throw new Error("Book name cannot be empty");
  }

  // TODO 4:
  // - read db
  const db = readDb();

  
  const maxNo = db.books.reduce((max, book) => 
    book.bookNo > max ? book.bookNo : max, 0
  );

  
  const newBook: Book = {
    bookNo: maxNo + 1,
    bookName: bookName,
  };

  
  db.books.push(newBook);
  writeDb(db);

  // - return newBook
  return newBook;
}

export function deleteBook(bookNo: number): boolean {
  const db = readDb();
  const initialLength = db.books.length;
  
  // Filter out the book with matching bookNo
  db.books = db.books.filter(book => book.bookNo !== bookNo);
  
  // Check if a book was actually deleted
  if (db.books.length < initialLength) {
    writeDb(db);
    return true;
  }
  return false;
}

export function searchBooks(query: string): Book[] {
  if (!query || query.trim() === "") {
    return readBooks();
  }
  
  const db = readDb();
  const lowerQuery = query.toLowerCase().trim();
  
  return db.books.filter(book => 
    book.bookName.toLowerCase().includes(lowerQuery)
  );
}