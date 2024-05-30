import { ServerRoute } from "@hapi/hapi";
const { addBookHandler, getAllBookHandler, getDetailBookHandler, updateBookHandler, deleteBookHandler } = require("../controllers/book.controller");

const bookRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/books",
    handler: addBookHandler,
  },
  {
    method: "GET",
    path: "/books",
    handler: getAllBookHandler,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getDetailBookHandler
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: updateBookHandler
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBookHandler
  },
  {
    method: "*",
    path: "/{any*}",
    handler: function (request, h) {
      return h
        .response({ status: "fail", message: "Endpoint not found" })
        .code(404);
    },
  },
];

module.exports = bookRoutes;
