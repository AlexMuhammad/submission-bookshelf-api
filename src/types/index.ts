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

export { IBookAddPayload };
