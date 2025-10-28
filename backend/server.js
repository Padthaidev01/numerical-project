const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); 

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const { makeFx } = require('./methods/eval.js');
const { bisection } = require('./methods/bisection.js');
const { falsePosition } = require('./methods/falsePosition.js');
const { graphical } = require('./methods/graphical.js');

app.post('/api/calculate/bisection', (req, res) => {
  try {
    const result = bisection(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/calculate/falsePosition', (req, res) => {
    try {
      const result = falsePosition(req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

app.post('/api/calculate/graphical', (req, res) => {
    try {
      const result = graphical(req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});