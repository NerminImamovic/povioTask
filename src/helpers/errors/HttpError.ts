import logger from '../../lib/logger';

class HttpError extends Error {
  public status: number;

  constructor({ status, message }: { status: number, message: string }) {
    super(message);
    this.status = status;

    this.logError();
  }

  private logError() {
    logger.error(`${this.status}: ${this.message}`);
  }
}

export { HttpError };
