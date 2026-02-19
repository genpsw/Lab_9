async function displayBooks(books) {
  const el = document.getElementById("book-list");
  el.innerHTML = books.map(b => `
    <div style="border: 1px solid #ccc; padding: 10px; margin: 5px 0; border-radius: 4px;">
      <div><strong>${b.bookNo}. ${b.bookName}</strong></div>
      <button onclick="deleteBookById(${b.bookNo})" style="background-color: red; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
    </div>
  `).join("");
}

async function loadBooks() {
  const res = await fetch("/api/books");
  const books = await res.json();
  displayBooks(books);
  document.getElementById("search-input").value = "";
}

async function searchBooks() {
  const query = document.getElementById("search-input").value;
  
  if (!query.trim()) {
    loadBooks();
    return;
  }
  
  const res = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
  const books = await res.json();
  displayBooks(books);
}

async function deleteBookById(bookNo) {
  if (!confirm("Are you sure you want to delete this book?")) {
    return;
  }
  
  try {
    const res = await fetch(`/api/books/delete/${bookNo}`, { method: "POST" });
    
    if (res.ok) {
      alert("Book deleted successfully");
      loadBooks();
    } else {
      alert("Failed to delete book");
    }
  } catch (err) {
    console.error(err);
    alert("Error deleting book");
  }
}

window.addEventListener("DOMContentLoaded", loadBooks);
