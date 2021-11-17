const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Sale = require('../models/sale');
const Car = require('../models/car');
const User = require('../models/user');

router
  .get('/', async (req, res) => {
    const sales = await Sale
      .find()

    if (!sales) return res.status(204).send('No hay ventas aun')

    res.status(200).send(sales);
  })

router
  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const sale = await Sale
      .findById(id)

    if (!sale) return res.status(404).send('No hay ninguna venta con ese ID');

    res.status(200).send(sale);
  })

router
  .post('/', async (req, res) => {
    const { userId, carId, price } = req.body;

    const user = await User
      .findById(userId)
    if (!user) return res.status(404).send('Usuario no existe');

    const car = await Car
      .findById(carId)
    if (!car) return res.status(404).send('Coche no existe');

    if (car.sold === true) return res.status(400).send('Ese coche ya ha sido vendido')

    const sale = new Sale({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      car: {
        _id: car._id,
        model: car.model
      },
      price
    });

    /*  const result = await sale.save();
     user.isCustomer = true;
     user.save();
 
     car.sold = true;
     car.save();
 
     res.status(201).send(result); */

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const result = await sale.save();

      user.isCustomer = true;
      user.save();

      car.sold = true;
      car.save();

      await session.commitTransaction()
      session.endSession()

      res.status(201).send(result);
    } catch (err) {
      await session.abortTransaction()
      session.endSession()
      res.status(500).send(err.message)
    }
  });

module.exports = router;