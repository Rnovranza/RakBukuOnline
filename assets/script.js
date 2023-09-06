let books = [];
const RENDER_EVENT = "render-books";

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function saveToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

function loadFromLocalStorage() {
  const storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks);
  }
}

function findBook(bookId) {
  for (book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function makeBook(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${author}`;

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${year}`;

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action");

  const buttonToggle = document.createElement("button");
  buttonToggle.classList.add(isComplete ? "green" : "red", "icon-button");
  buttonToggle.innerHTML = isComplete
    ? '<i class="fa-regular fa-circle-check fa-lg"></i>'
    : '<i class="fa-solid fa-circle-check fa-lg"></i>';
  buttonToggle.addEventListener("click", function () {
    toggleBookCompletion(id);
  });

  const buttonRemove = document.createElement("button");
  buttonRemove.classList.add("red", "icon-button");
  buttonRemove.innerHTML = '<i class="fa-solid fa-trash fa-lg"></i>';
  buttonRemove.addEventListener("click", function () {
    removeBook(id);
  });

  actionContainer.append(buttonToggle, buttonRemove);

  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");
  bookItem.append(bookTitle, bookAuthor, bookYear, actionContainer);

  return bookItem;
}

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    isComplete
  );
  books.push(bookObject);

  saveToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function toggleBookCompletion(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = !bookTarget.isComplete;
  saveToLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBook(bookId) {
  const bookTargetIndex = findBookIndex(bookId);
  if (bookTargetIndex === -1) return;

  // Tampilkan pop-up konfirmasi dari browser
  const isConfirmed = window.confirm(
    "Apakah Anda yakin ingin menghapus buku ini?"
  );

  if (isConfirmed) {
    // Jika pengguna menekan "OK" pada dialog konfirmasi, maka hapus buku
    books.splice(bookTargetIndex, 1);
    saveToLocalStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  // Jika pengguna menekan "Batal" pada dialog konfirmasi, maka tidak ada yang dilakukan.
}

function searchBooks() {
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const searchResults = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (bookItem of searchResults) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelfList.append(bookElement);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  const searchForm = document.getElementById("searchBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBooks();
  });

  loadFromLocalStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelfList.append(bookElement);
    }
  }
});
