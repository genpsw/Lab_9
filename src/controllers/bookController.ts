import { Request, Response } from "express";
import * as db from "../services/fileDb";

export function home(req: Request, res: Response) {
	return res.render("home");
}

export function listBooks(req: Request, res: Response) {
	const books = db.getAll();
	return res.render("books", { books });
}

export function searchBooks(req: Request, res: Response) {
	const name = (req.query.name as string) || "";
	const books = db.searchByName(name);
	return res.render("books", { books, query: name });
}

export function addBook(req: Request, res: Response) {
	try {
		const bookName = (req.body.bookName || "").toString().trim();
		if (!bookName) {
			// Re-render with an error message (simple approach)
			const books = db.getAll();
			return res.status(400).render("books", { books, error: "bookName is required" });
		}

		db.add(bookName);
		return res.redirect("/books");
	} catch (err) {
		console.error(err);
		return res.status(500).send("Server error");
	}
}
