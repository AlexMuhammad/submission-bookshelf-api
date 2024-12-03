import { Request, ResponseToolkit } from "@hapi/hapi";
import { IBooksResponse, type IBookAddPayload } from "../types";
import books from "../models/index";
import { nanoid } from "nanoid";

const addBookHandler = (request: Request, h: ResponseToolkit) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = <IBookAddPayload>request.payload;
  const id = nanoid(16);

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const finished = pageCount === readPage;
  try {
    const newBooks = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      insertedAt,
      updatedAt,
    };
    books.push(newBooks);
    const isSuccess =
      books.filter((book: IBooksResponse) => book.id === id).length > 0;

    if (!name) {
      const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    }

    if (!isSuccess) {
      const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }

    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    h.response({ status: "fail", message: "Something went wrong" }).code(500);
  }
};

const getAllBookHandler = (request: Request, h: ResponseToolkit) => {
  const { name, reading, finished } = request.query;
  if (name) {
    books.filter((book: IBooksResponse) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading !== undefined) {
    books.filter((book: IBooksResponse) =>
      reading === "1" ? book.reading : !book.reading
    );
  }

  if (finished !== undefined) {
    books.filter((book: IBooksResponse) =>
      finished === "1" ? book.finished : !book.finished
    );
  }

  try {
    const responseBooks = books
      .map((book: IBooksResponse) => {
        if (book.name) {
          return {
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          };
        }
        return null;
      })
      .filter((book) => book !== null);
    console.log(responseBooks);

    if (responseBooks.length === 0) {
      return h
        .response({
          status: "success",
          data: {
            books: [],
          },
        })
        .code(200);
    }

    if (responseBooks.length > 2) {
      responseBooks.splice(2);
    }

    return h
      .response({
        status: "success",
        data: {
          books: responseBooks,
        },
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Something went wrong",
      })
      .code(500);
  }
};

const getDetailBookHandler = (request: Request, h: ResponseToolkit) => {
  const { bookId } = request.params;

  try {
    const book = books.find((book: IBooksResponse) => book.id === bookId);

    if (book) {
      return h
        .response({
          status: "success",
          data: {
            book,
          },
        })
        .code(200);
    }

    return h
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404);
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Something went wrong",
      })
      .code(500);
  }
};

const updateBookHandler = (request: Request, h: ResponseToolkit) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = <IBookAddPayload>request.payload;

  const index = books.findIndex((book: IBooksResponse) => book.id === bookId);
  const updatedAt = new Date().toISOString();

  try {
    if (!name) {
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }

    if (index !== -1) {
      const updatedBook = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };

      books[index] = updatedBook;

      const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
        data: {
          book: updatedBook,
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "Something went wrong",
    });
    response.code(500);
    return response;
  }
};

const deleteBookHandler = (request: Request, h: ResponseToolkit) => {
  const { bookId } = request.params;
  const index = books.findIndex((book: IBooksResponse) => book.id === bookId);
  try {
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: "success",
        message: "Buku berhasil dihapus",
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  } catch (error) {
    h.response({ status: "fail", message: "Something went wrong" }).code(500);
  }
};

export {
  addBookHandler,
  getAllBookHandler,
  getDetailBookHandler,
  deleteBookHandler,
  updateBookHandler,
};
