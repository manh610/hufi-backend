import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import fs from 'fs';
import swaggerUi = require('swagger-ui-express');
import mongoose from "mongoose";
import path from 'path';

import { RegisterRoutes } from './routes';

import { requestLoggerMiddleware } from './middleware/request.logger.middleware';

import './components/event/event.controller';
import './components/student/student.controller';
import './components/studentEvent/studentEvent.controller';
import './components/teacher/teacher.controller';
import './components/trainingMark/trainingMark.controller';

const app = express();

mongoose.connect(process.env.MONGO_DB ?? '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    dbName: process.env.MONGO_DB_NAME,
}).then(() => console.log('Connected to mongodb')).catch(err => {console.log(process.env.MONGO_DB); console.log({ err }) });
app.use(cors());
app.use(bodyparser.json());

// TODO - add middleware
app.use(requestLoggerMiddleware);


const isProductionMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const publicDir = isProductionMode ? '/v2/public' : '/public';
const staticDir = isProductionMode ? './public' : '../public';

/* Swagger files start */
const swaggerFile: any = (process.cwd()+"/swagger.json");
const swaggerData: any = fs.readFileSync(swaggerFile, 'utf8');
const swaggerDocument = JSON.parse(swaggerData);
/* Swagger files end */

app.use(publicDir, express.static(path.join(__dirname, staticDir)));

app.use(express.json());

RegisterRoutes(app);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { app };