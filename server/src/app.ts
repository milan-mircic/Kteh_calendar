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

export const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
// session: false everywhere — we authenticate via our own JWT cookie, not
// passport sessions, but passport.initialize() is still required to make
// passport.authenticate(...) usable in the Google OAuth routes.
app.use(passport.initialize());

app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/account', accountRouter);
app.use('/api/quote', quoteRouter);

app.use(errorHandler);
