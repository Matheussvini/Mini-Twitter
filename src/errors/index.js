function conflictError(message) {
  return {
    name: 'ConflictError',
    message,
  };
}

function unprocessableEntityError(message) {
  return {
    name: 'UnprocessableEntityError',
    message,
  };
}

function invalidCredentialsError(message) {
  return {
    name: 'InvalidCredentialsError',
    message,
  };
}

function notFoundError(message) {
  return {
    name: 'NotFoundError',
    message,
  };
}

function unauthorizedError(message) {
  return {
    name: 'UnauthorizedError',
    message,
  };
}

export default {
  conflictError,
  unprocessableEntityError,
  invalidCredentialsError,
  notFoundError,
  unauthorizedError,
};
