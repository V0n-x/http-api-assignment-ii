const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
  const body = [];
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });
  request.on('data', (chunk) => {
    body.push(chunk);
  });
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
    handler(request, response, bodyParams);
  });
};

const post = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    parseBody(request, response, jsonHandler.addUser);
  }
};

const get = (request, response, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getCSS(request, response);
      break;
    case '/getUsers':
      jsonHandler.getUsers(request, response);
      break;
    case '/notReal':
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({
        message: 'The page you are looking for was not found',
        id: 'notFound',
      }));
      response.end();
      break;
    default:
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({
        message: 'The page you are looking for was not found',
        id: 'notFound',
      }));
      response.end();
      break;
  }
};

const head = (request, response, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/getUsers':
      jsonHandler.getUsers(request, response);
      break;
    case '/notReal':
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end();
      break;
    default:
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end();
      break;
  }
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  switch (request.method) {
    case 'POST':
      post(request, response, parsedUrl);
      break;
    case 'GET':
      get(request, response, parsedUrl);
      break;
    case 'HEAD':
      head(request, response, parsedUrl);
      break;
    default:
      break;
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
