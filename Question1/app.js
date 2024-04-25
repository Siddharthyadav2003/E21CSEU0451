const express = require('express');
const request = require('request');

const app = express();
const port = 9876;
const window_size = 10;
let number_store = [];

app.get('/numbers/:numberid', (req, res) => {
  const numberId = req.params.numberid;
  const windowPrevState = number_store.slice();

  let new_numbers = [];
  request(`http://20.244.56.144/test/${numberId}`, (error, response, body) => {
    if (!error && response.statusCode === 200 && response.elapsedTime < 500) {
      const data = JSON.parse(body);
      new_numbers = data.numbers.filter(num => !number_store.includes(num));
      number_store.push(...new_numbers);
      number_store = number_store.slice(-window_size);

      const avg = number_store.length === window_size ? number_store.reduce((sum, num) => sum + num, 0) / window_size : 0.0;

      res.json({
        windowPrevState,
        windowCurrState: number_store,
        numbers: new_numbers,
        avg
      });
    } else {
      // Handle errors or timeouts
      res.status(500).send('Error fetching numbers');
    }
  });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
