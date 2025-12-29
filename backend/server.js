
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();

// Debug logs for environment variables (safely logged)
console.log('--- Environment Check ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
console.log('-------------------------');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


// Database Connection
connectDB();

// Cron Jobs
import initCronJobs from './utils/cronJobs.js';
initCronJobs();




// Routes
import userRoutes from './routes/userRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';

import doseLogRoutes from './routes/doseLogRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import caregiverRoutes from './routes/caregiverRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

app.use('/api/users', userRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/logs', doseLogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
