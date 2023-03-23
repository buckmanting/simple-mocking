const {returnMock} = require('./middleware/return-mock');
const {logRequest} = require('./middleware/log-request');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(logRequest());

app.use(returnMock());

const port = process.env.PORT ?? 5010;
app.listen(port, () => {
    console.info(`🎬 server started on http://localhost:${port}`);
});