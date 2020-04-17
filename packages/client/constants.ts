// should probably do this in .env... meh

export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://jou-server.herokuapp.com'
    : 'http://localhost:8000'
