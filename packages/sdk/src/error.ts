export class RateLimitExceedError extends Error {
  constructor() {
    super("Rate Limit Exceeded");
  }
}
export class NullResponseError extends Error {
  constructor() {
    super("Null Response");
  }
}
