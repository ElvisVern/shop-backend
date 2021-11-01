export class ApiException extends Error {

  statusCode: number;
  errorMessage?: string;

  constructor(statusCode = 500, errorMessage: string) {
    super();
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
  }
}