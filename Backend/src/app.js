import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimiter from './middleware/rateLimit.middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/index.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorMid.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors())
app.use(helmet({
  crossOriginResourcePolicy: false, // Required to serve files to frontend
}));
app.use(morgan('dev'));
app.use(compression())

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// // Rate Limit
app.use(rateLimiter);

app.use("/api/v1", router);


app.use(notFound);
app.use(errorHandler)



// Test Route
app.get("/", (req, res)=>{
    res.json({
        sucess:true,
        message: "AI SaaS Backend Running 🚀"
    })

})
export default app;