require("dotenv").config();

const express = require("express"),
  cookieParser = require("cookie-parser"),
  logger = require("morgan"),
  crypto = require("crypto"),
  db = require("./clients/db"),
  Vault = require("./clients/vault"),
  indexRouter = require("./routes/index"),
  { ApiError, BadSignatureError, NotFoundError } = require("./errors/api"),
  app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Curried middleware ensuring all errors
 * are caught and end up in **next()**.
 *
 * @param {*} cb Any Express.js middleware function.
 */
const tryCatch = (cb) => async (req, res, next) => {
  try {
    return await cb(req, res, next);
  } catch (e) {
    next(e);
  }
};

/**
 * Signature Authentication Middelware
 */
app.use(
  tryCatch(async (req, _res, next) => {
    const { headers, method, path, body = "" } = req;
    const headerApiKey = headers["x-api-key"];
    const headerSignature = headers["x-api-signature"];
    const headerTimestamp = headers["x-api-timestamp"];

    if (!headerApiKey || !headerSignature || !headerTimestamp)
      throw new BadSignatureError();

    const application = await db.findApplicationByAPIKey(headerApiKey);

    // NOTE: Do not indicate whether or not the application exists.
    if (!application) throw new BadSignatureError();

    const vault = new Vault();
    const { secret } = await vault.readPath(application.credentials_path);

    const newSignature = crypto
      .createHmac("sha256", secret)
      .update(`${headerTimestamp}${method}${path}${JSON.stringify(body)}`)
      .digest("hex");

    const a = Buffer.from(headerSignature);
    const b = Buffer.from(newSignature);

    // Signature lengths don't match, bail early.
    if (a.length !== b.length) {
      throw new BadSignatureError();
    }

    const isValidSignature = crypto.timingSafeEqual(
      Buffer.from(headerSignature),
      Buffer.from(newSignature)
    );

    if (!isValidSignature) throw new BadSignatureError();

    req.application_id = application.id;
    next();
  })
);

/**
 * Application Routes
 */
app.use("/", indexRouter);

/**
 * Handle all 404s
 */
app.use((_req, res, _next) => {
  const { status, description, error } = new NotFoundError(
    `The requested resource could not be found. Please check the request path and method.`
  );
  res.status(status).json({
    description,
    error,
  });
});

/**
 * Handle all errors
 */
app.use((err, _req, res, _next) => {
  console.error({
    stack: err.stack,
    error: err,
    timetstamp: new Date().toISOString(),
  });

  // NOTE: Default error is 500
  let outgoingError = new ApiError();

  if (err instanceof ApiError) {
    outgoingError = err;
  }

  res.status(outgoingError.status).json({
    description: outgoingError.description,
    error: outgoingError.error,
  });
});

module.exports = app;
