const mongoose = require('mongoose');
const express = require('express');
const app = express();
const car = require('./routes/cars')
const PORT = process.env.PORT || 3003;
const date = require('./date');
const morgan = require('morgan');

app.use(date);
app.use(express.json());
app.use('/api/cars', car);
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

mongoose.connect('mongodb://localhost:27017/carsdb2')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(() => console.log('No se ha conectado a MongoDB'))

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto localhost:${PORT}`);
});