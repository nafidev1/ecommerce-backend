module.exports = (err, req, res, next) => {
  console.log(err);

  if (err.name === "ValidationError")
    return (err = handleValidationError(err, res));
  if (err.code && err.code == 11000)
    return (err = handleDuplicateKeyError(err, res));

  const errMessage = err.message || "Something went wrong";
  const errStatus = err.status || 500;
  const errStack = err.stack;
  return res.status(500).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: errStack,
  });
};

//handle email or usename duplicates
const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue); // extract field for error
  const code = 409;
  const error = `An account with that ${field} already exists. `;
  res.status(code).send({ message: error, fields: field });
};
//handle field formatting, empty fields, and mismatched passwords
const handleValidationError = (err, res) => {
  // Using el.message to get the error message we added in our user model.
  let errors = Object.values(err.errors).map((el) => el.message);
  let fields = Object.values(err.errors).map((el) => el.path);
  let code = 400;
  // Detecting if errors > 1, and joining all messages together with a space, so they become one string.
  if (errors.length > 1) {
    const formattedErrors = errors.join("");
    res.status(code).send({ message: formattedErrors, fields: fields });
  } else {
    res.status(code).send({ message: errors, fields: fields });
  }
};
