const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('API is working');
});

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
