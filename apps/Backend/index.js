import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/index.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001; // Change the port number from 3000 to 3001

// CORS Config
const whitelist = [
  "https://tnp-nitkkr.vercel.app",
  "http://localhost:5178",
  "http://localhost:5179",
  "http://localhost:5184",
  "https://project-p-final-frontend.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Route Handler
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/user/*',
      status: '/api/v1/status'
    }
  });
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState,
  });
});

app.use("/api/v1", router);

// Enhanced Error Handler
app.use((err, req, res, next) => {
  console.error("Detailed Error:", {
    error: err,
    stack: err.stack,
    body: req.body,
    path: req.path,
    method: req.method,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// MongoDB Connection and Server Startup
const startServer = async (retryCount = 0, maxRetries = 5) => {
  try {
    // Connect to MongoDB first
    await mongoose.connect(process.env.DATABASE_URI, {
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 50,
      minPoolSize: 10,
      retryWrites: true,
      w: "majority",
    });
    console.log("Connected to MongoDB Atlas");

    // Try to find an available port
    let currentPort = 3001;
    let server = null;

    while (!server && currentPort <= 3010) {
      try {
        server = await new Promise((resolve, reject) => {
          const s = app
            .listen(currentPort)
            .on("listening", () => {
              console.log(`Server running on port ${currentPort}`);
              resolve(s);
            })
            .on("error", (err) => {
              if (err.code === "EADDRINUSE") {
                currentPort++;
                resolve(null);
              } else {
                reject(err);
              }
            });
        });
      } catch (err) {
        console.error(`Failed to start server on port ${currentPort}:`, err);
        currentPort++;
      }
    }

    if (!server) {
      throw new Error("No available ports found between 3001 and 3010");
    }

    // Graceful shutdown
    ["SIGTERM", "SIGINT"].forEach((signal) => {
      process.on(signal, async () => {
        console.log(`${signal} received, starting shutdown`);
        await server.close();
        await mongoose.connection.close();
        console.log("Server shutdown complete");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Startup error:", error);
    if (retryCount < maxRetries) {
      console.log(`Retrying in 5 seconds... (${retryCount + 1}/${maxRetries})`);
      setTimeout(() => startServer(retryCount + 1, maxRetries), 5000);
    } else {
      console.error("Max retries reached. Exiting...");
      process.exit(1);
    }
  }
};

// Handle MongoDB disconnection
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

// Start the server
startServer();

export default app;
