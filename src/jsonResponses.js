const users = {};
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  if (request.method === 'GET') {
    respondJSON(request, response, 200, responseJSON);
  } else if (request.method === 'HEAD') {
    respondJSONMeta(request, response, 200);
  }
};
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };
  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  let responseCode = 204;
  if (!users[body.name]) {
    responseCode = 201;
    users[body.name] = {};
  }
  users[body.name].name = body.name;
  users[body.name].age = body.age;
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    console.log(respondJSON);
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};
module.exports = {
  getUsers,
  addUser,
};
