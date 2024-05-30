import { type IBookAddPayload } from "../types";

interface IBooksResponse extends IBookAddPayload {
  id: number;
  finished: boolean;
}

const books: IBooksResponse[] = [];

module.exports = books;