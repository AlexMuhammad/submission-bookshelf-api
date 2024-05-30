import { Request, ResponseToolkit } from "@hapi/hapi";
import { type IBookAddPayload } from "../types";

const books = require("../models/index");
const { nanoid } = require("nanoid");

interface ItemResponse extends IBookAddPayload {
  id: number;
  finished: boolean;
}

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
      books.filter((book: ItemResponse) => book.id === id).length > 0;

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
        books: books,
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
  const book = books.filter((book: ItemResponse) => book.id === bookId)[0];
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
  const index = books.findIndex((book: ItemResponse) => book.id === bookId);
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
  const index = books.findIndex((book: ItemResponse) => book.id === bookId);
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

module.exports = { addBookHandler, getAllBookHandler, getDetailBookHandler, deleteBookHandler, updateBookHandler };
