interface IBookAddPayload {
  name: string;
  year: number;
  author: string;
  summary: string;
  publisher: string;
  pageCount: number;
  readPage: number;
  reading: boolean;
}

interface IBooksResponse extends IBookAddPayload {
  id: string;
  finished: boolean;
  insertedAt: string;
  updatedAt: string;
}

export { IBookAddPayload, IBooksResponse };
