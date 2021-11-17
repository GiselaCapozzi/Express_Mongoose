const mongoose = require('mongoose');
const express = require('express');
const app = express();

const car = require('./routes/cars');
const user = require('./routes/users');
const companies = require('./routes/companies');
const sales = require('./routes/sales');
const auth = require('./routes/auth');

const PORT = process.env.PORT || 3003;
const date = require('./date');
const morgan = require('morgan');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(date);

app.use('/api/cars/', car);
app.use('/api/users/', user);
app.use('/api/companies', companies);
app.use('/api/sales', sales);
app.use('api/auth', auth);

mongoose.connect('mongodb://localhost:27017/carsdb2')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(() => console.log('No se ha conectado a MongoDB'))

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto localhost:${PORT}`);
});