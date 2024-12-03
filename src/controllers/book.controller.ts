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

  let filteredBooks: IBooksResponse[] = books;

  if (name) {
    filteredBooks = filteredBooks.filter((book: IBooksResponse) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading !== undefined) {
    if (reading === "1") {
      filteredBooks = filteredBooks.filter(
        (book: IBooksResponse) => book.reading
      );
    } else if (reading === "0") {
      filteredBooks = filteredBooks.filter(
        (book: IBooksResponse) => !book.reading
      );
    }
  }

  if (finished !== undefined) {
    if (finished === "1") {
      filteredBooks = filteredBooks.filter(
        (book: IBooksResponse) => book.finished
      );
    } else if (finished === "0") {
      filteredBooks = filteredBooks.filter(
        (book: IBooksResponse) => !book.finished
      );
    }
  }

  try {
    const isBookEmpty = books.length < 0;
    if (isBookEmpty) {
      const response = h.response({
        status: "success",
        data: {
          books: [],
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: "success",
      data: {
        books: filteredBooks.map((book: IBooksResponse) => {
          if (book.name !== undefined) {
            return {
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            };
          }
        }),
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    h.response({ status: "fail", message: "Something went wrong" }).code(500);
  }
};

const getDetailBookHandler = (request: Request, h: ResponseToolkit) => {
  const { bookId } = request.params;
  const book = books.filter((book: IBooksResponse) => book.id === bookId)[0];
  try {
    if (book !== undefined) {
      const response = h.response({
        success: "success",
        data: {
          books: book,
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });

    response.code(404);
    return response;
  } catch (error) {
    h.response({ status: "fail", message: "Something went wrong" }).code(500);
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
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }

    if (index !== -1) {
      books[index] = {
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
      const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
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
    h.response({ status: "fail", message: "Something went wrong" }).code(500);
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
