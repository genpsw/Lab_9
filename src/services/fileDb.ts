import fs from "fs";
import path from "path";
import { Book, DbShape } from "../models/Book";

const dbPath = path.join(process.cwd(), "data", "books.json");

function readDb(): DbShape {
  const dirPath = path.dirname(dbPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (!fs.existsSync(dbPath)) {
    const initialData: DbShape = { books: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  const fileContent = fs.readFileSync(dbPath, "utf-8");
  if (!fileContent.trim()) return { books: [] };
  return JSON.parse(fileContent) as DbShape;
}

function writeDb(db: DbShape) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
}

export function getAll(): Book[] {
  return readDb().books;
}

export function add(bookName: string): Book {
  if (!bookName || bookName.trim() === "") {
    throw new Error("Book name cannot be empty");
  }

  const db = readDb();
  const maxNo = db.books.reduce((max, b) => (b.bookNo > max ? b.bookNo : max), 0);
  const newBook: Book = { bookNo: maxNo + 1, bookName: bookName.trim() };
  db.books.push(newBook);
  writeDb(db);
  return newBook;
}

export function remove(bookNo: number): boolean {
  const db = readDb();
  const initial = db.books.length;
  db.books = db.books.filter(b => b.bookNo !== bookNo);
  if (db.books.length < initial) {
    writeDb(db);
    return true;
  }
  return false;
}

export function searchByName(name: string): Book[] {
  if (!name || name.trim() === "") return getAll();
  const q = name.toLowerCase().trim();
  return readDb().books.filter(b => b.bookName.toLowerCase().includes(q));
}
