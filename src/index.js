const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors())
app.use(bodyParser.json());

const port = 5000;

app.get('/', (req, res) => {
    res.send('API is working');
});

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
