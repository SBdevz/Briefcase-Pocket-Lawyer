import app from '../Server.js';

export const config = {
  api: { bodyParser: false },
};

export default function handler(request, response) {
  return app(request, response);
}