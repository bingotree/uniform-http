export default class UniformHttpError extends Error {
  constructor(message, details) {
    super(message);
    this.stack = Error().stack;
    this.details = details;
    this.name = 'UniformHttpError';
  }
}
