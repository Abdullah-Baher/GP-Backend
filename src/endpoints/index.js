require('dotenv').config()
require('./db/dbConnection');

const express = require('express');
const morgan = require('morgan');

const usersRouter = require('./routers/users_router');
const projectsRouter = require('./routers/projects_router');
const filesRouter = require('./routers/files_router');
const tasksRouter = require('./routers/tasks_router');
const codeReviewsRouter = require('./routers/codeReview_router');

const app = express();


app.use(express.json());
app.use(morgan("dev"));

app.use(usersRouter);
app.use(projectsRouter);
app.use(filesRouter);
app.use(tasksRouter);
app.use(codeReviewsRouter);


const port = process.env.PORT || 3001;

app.listen(port, () => {

    
    console.log(`server is up on port ${port}`);
});