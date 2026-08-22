import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { activitiesRouter } from './routes/activities';
import { accountRouter } from './routes/account';
import { quoteRouter } from './routes/quote';
import { errorHandler } from './middleware/errorHandler';
import { passport } from './lib/googleAuth';
import { UPLOADS_DIR } from './lib/avatarUpload';

export const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/account', accountRouter);
app.use('/api/quote', quoteRouter);

app.use(errorHandler);
