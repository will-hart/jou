// should probably do this in .env... meh

export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://jou-server.herokuapp.com'
    : 'http://localhost:8000'

export const DEMO_BASE_CARD_PATH =
  'https://jou-cards.s3-ap-southeast-2.amazonaws.com'
