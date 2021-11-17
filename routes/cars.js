const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Car = require('../models/car');
const { Company } = require('../models/company');

// GET
router
  .get('/', async (req, res) => {
    const cars = await Car
      .find()
      .populate('company', 'name country')
    res.send(cars);
    // console.log(cars);
  });

router
  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const car = await Car
      .findById(id)

    if (!car) return res.status(404).send('No hemos encontrado un coche con ese ID');
    res.send(car);
  })

// POST

// Modelo de datos Embebido
router
  .post('/', async (req, res) => {
    const { id } = req.body;

    const company = await Company
      .findById(id)

    if (!company) return res.status(400).send('No tenemos ese fabricante')

    const { model, year, sold, price, extras } = req.body;
    const car = new Car({
      company,
      model,
      year,
      sold,
      price,
      extras
    })

    const result = await car.save();
    res.status(201).send(result);
  })

// Modelo de datos Normalizado
/* router
  .post('/', async (req, res) => {

    const car = new Car({
      company: req.body.company,
      model: req.body.model,
      year: req.body.year,
      sold: req.body.sold,
      price: req.body.price,
      extras: req.body.extras
    })

    const result = await car.save();
    res.status(201).send(result);
  }); */

// PUT
router
  .put('/:id', [
    check('company').isLength({ min: 3 }),
    check('model').isLength({ min: 3 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const car = await Car
      .findByIdAndUpdate(id, {
        company: req.body.company,
        model: req.body.model,
        year: req.body.year,
        sold: req.body.sold,
        price: req.body.price,
        extras: req.body.extras
      }, {
        new: true
      })

    if (!car) {
      return res.status(404).send('El coche con ese id no esta');
    }

    res.status(204).send(car);
  });

// DELETE
router
  .delete('/:id', async (req, res) => {
    const { id } = req.params;
    const car = await Car
      .findByIdAndDelete(id)

    if (!car) {
      return res.status(404).send('El coche con ese ID no existe');
    }

    res.status(200).send('El coche ha sido borrado correctamente');
  })

module.exports = router;