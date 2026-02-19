import express from "express";
import path from "path";
import * as controller from "./controllers/bookController";
import * as db from "./services/fileDb";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", controller.home);
app.get("/books", controller.listBooks);
app.get("/books/search", controller.searchBooks);
app.post("/books", controller.addBook);

// JSON API endpoints (used by public/*.html + app.js)
app.get("/api/books", (req, res) => {
  return res.json(db.getAll());
});

app.get("/api/books/search", (req, res) => {
  const q = (req.query.q as string) || "";
  return res.json(db.searchByName(q));
});

app.post("/api/books/add", (req, res) => {
  try {
    const bookName = (req.body.bookName || "").toString().trim();
    if (!bookName) {
      if (req.headers.accept && req.headers.accept.includes("application/json")) {
        return res.status(400).json({ error: "bookName is required" });
      }
      return res.status(400).redirect("/");
    }
    const added = db.add(bookName);
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.json(added);
    }
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

app.post("/api/books/delete/:bookNo", (req, res) => {
  try {
    const bookNo = parseInt(req.params.bookNo);
    if (isNaN(bookNo)) return res.status(400).json({ error: "invalid bookNo" });
    const ok = db.remove(bookNo);
    return res.json({ success: ok });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
