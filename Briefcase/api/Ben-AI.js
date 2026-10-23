import app from '../Server.js';

export default function handler(request, response) {
  return app(request, response);
}