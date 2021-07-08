require('dotenv').config()
require('./db/dbConnection');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const usersRouter = require('./routers/users_router');
const projectsRouter = require('./routers/projects_router');
const filesRouter = require('./routers/files_router');
const tasksRouter = require('./routers/tasks_router');
const codeReviewsRouter = require('./routers/codeReview_router');
const channelsRouter = require('./routers/channel_router');
const messagesRouter = require('./routers/messages_router');


const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(usersRouter);
app.use(projectsRouter);
app.use(filesRouter);
app.use(tasksRouter);
app.use(codeReviewsRouter);
app.use(channelsRouter);
app.use(messagesRouter);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
});