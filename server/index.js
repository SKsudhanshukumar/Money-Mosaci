import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import kpiRoutes from "./routes/kpi.js";
import productRoutes from "./routes/product.js";
import transactionRoutes from "./routes/transaction.js";
import KPI from "./models/KPI.js";
import Product from "./models/Product.js";
import Transaction from "./models/Transaction.js";
import { kpis, products, transactions } from "./data/data.js";


/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes);
app.use("/transaction", transactionRoutes);

/* MONGOOSE SETUP */


mongoose.Promise = global.Promise;

const MONGO_URI = "mongodb+srv://sudhanshukumar337:TCA2357052@cluster0.8h0fssy.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0";

const PORT = process.env.PORT || 9000;

// Function to find an available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const port = parseInt(startPort);
    if (port >= 65536) {
      reject(new Error('No available ports found'));
      return;
    }
    
    const server = app.listen(port, () => {
      const actualPort = server.address().port;
      server.close(() => resolve(actualPort));
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}...`);
        findAvailablePort(port + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
};

mongoose.connect(MONGO_URI)
  .then(async () => {
    try {
      const availablePort = await findAvailablePort(PORT);
      
      const server = app.listen(availablePort, () => {
        console.log(`🚀 Server successfully started on port: ${availablePort}`);
        if (availablePort !== PORT) {
          console.log(`⚠️  Note: Requested port ${PORT} was busy, using port ${availablePort} instead`);
        }
      });

      // Handle server errors
      server.on('error', (err) => {
        console.error('❌ Server error:', err.message);
        process.exit(1);
      });

      // Graceful shutdown handling
      process.on('SIGTERM', () => {
        console.log('🛑 SIGTERM received, shutting down gracefully...');
        server.close(() => {
          console.log('✅ Server closed');
          mongoose.connection.close(false, () => {
            console.log('✅ MongoDB connection closed');
            process.exit(0);
          });
        });
      });

      process.on('SIGINT', () => {
        console.log('🛑 SIGINT received, shutting down gracefully...');
        server.close(() => {
          console.log('✅ Server closed');
          mongoose.connection.close(false, () => {
            console.log('✅ MongoDB connection closed');
            process.exit(0);
          });
        });
      });

      /* ADD DATA ONE TIME ONLY OR AS NEEDED */
      await mongoose.connection.db.dropDatabase();
      KPI.insertMany(kpis);
      Product.insertMany(products);
      Transaction.insertMany(transactions);
      
    } catch (error) {
      console.error('❌ Failed to start server:', error.message);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  });