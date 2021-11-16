const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Car = require('../models/car');

// GET
router
  .get('/', async (req, res) => {
    const cars = await Car
      .find();
      res.send(cars);
      console.log(cars);
  });

router
  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const car = await Car
      .findById(id)

      if(!car) return res.status(404).send('No hemos encontrado un coche con ese ID');
      res.send(car);
  })

// POST
router
  .post('/', [
    check('company').isLength({ min: 3 }),
    check('model').isLength({ min: 3 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { company, model, year, sold, price, extras } = req.body;

    const car = new Car({
      company: company,
      model: model,
      year: year,
      sold: sold,
      price: price,
      extras: extras
    })

    const result = await car.save();
    res.status(201).send(result);
  });

// PUT
router
  .put('/:id', [
    check('company').isLength({ min: 3 }),
    check('model').isLength({ min: 3 })
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const coche = coches.find(coche => coche.id === parseInt(id));

    if (!coche) {
      return res.status(404).send('El coche con ese id no esta');
    }

    const { company, model, year } = req.body;
    coche.company = company;
    coche.model = model;
    coche.year = year;

    res.status(204).send();
  });

// DELETE
router
  .delete('/:id', (req, res) => {
    const { id } = req.params;
    const coche = coches.find(coche => coche.id === parseInt(id));

    if (!coche) {
      return res.status(404).send('El coche con ese ID no existe');
    }

    const index = coches.indexOf(coche);
    coches.splice(index, 1);

    res.status(200).send('El coche ha sido borrado correctamente');
  })

module.exports = router;