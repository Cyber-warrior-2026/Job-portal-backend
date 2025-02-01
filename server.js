//imports
//const express= require("express");
//API Documentation
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from 'swagger-jsdoc';
//packages imports
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import morgan from 'morgan';
import 'express-async-errors';
//security packagees
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

//files import
import connectDB from './config/db.js';
//routes import
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import jobsRoutes from './routes/jobsRoutes.js';
import userRoutes from './routes/userRoutes.js';

//dot env config
dotenv.config();
//mongodb connection
connectDB();

//Swagger api config
//Swagger api options
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'job portal application',
            description: 'Node Expressjs Job Portal Application'
        },
        servers: [
            {
                //This was a local host url to test the application during development
              //  url: "http://localhost:8080"
                //this is the url after deployment on render
                url:"https://job-portal-backend-cgmt.onrender.com"
            }
        ]
    },
    apis: ['./routes/*.js'],
};
const spec = swaggerDoc(options);


//rest object
const app = express();


//middlewares
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


//routes
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobsRoutes);

//homeroute root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

//validation middleware
app.use(errorMiddleware);

//port
const PORT = process.env.PORT || 8080;
//listen
app.listen(PORT, () => {
    console.log(`Node Server Running in ${process.env.DEV_MODE} Mode on port no ${PORT}`.bgYellow.black);
});
