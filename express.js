require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const http = require("http");

const authRoutes = require("./backend/routes/authRoutes");
const { initSocket } = require("./backend/socketHandler");
const logger = require("./utils/logger");

const app = express();
const server = http.createServer(app);


//ports
const PORT = process.env.APP_PORT;
const reactPORT = process.env.REACT_TEST_PORT

//cors set-up
app.use(
  cors({
    origin: [
      `http://localhost:${PORT}`,
      `http://localhost:${reactPORT}`
    ], 
    credentials: true,
  })
);

//middleware
if (process.env.NODE_ENV === "production") {
  // Strict helmet settings for live environment
  app.use(helmet());
} else {
  // Relaxed CSP for local development
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "script-src": ["'self'", "'unsafe-inline'"],
        },
      },
    })
  );
}

app.use(express.json());
app.use(cookieParser());

//routes
app.use("/auth", authRoutes);

//landing page route
app.get("/", (req, res) => {
  res.send("Welcome to KhleanCutz Salon");
});


//Socket set-up
initSocket(server);


// Render deployment
app.get("/healthz", (req, res) => res.send("OK"));

// catch unavailable route
app.use('', (req, res)=>{
    res.status(404).json({ message: "Route not found" });
})
// Error handler
app.use((err, req, res, next) => {
  if (err) {
    console.log(err.stack);
    res
      .status(500)
      .json({ message: `Internal Server Error` });
  }
});


server.listen(PORT, () => {
  logger.info(`Server started on http://localhost:${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);

  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
    process.exit(1); // stop app to avoid broken state
  });
  //catch uncaught promise
  process.on("unhandledRejection", (err) => {
    logger.error(`Unhandled Rejection: ${err.message || err}`);
    process.exit(1);
  });
});
