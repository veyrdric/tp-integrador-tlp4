// Error con código HTTP. Lo lanzan los services y lo traduce el errorHandler.
export class AppError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
