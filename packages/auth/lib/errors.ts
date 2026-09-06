export class UnauthorizedError extends Error {
  constructor(message = "Authentication is required") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
