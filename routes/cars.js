const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const carSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    minlength: 2,
    maxlength: 99,
    enum: ['BMW', 'AUDI', 'SEAT']
  },
  model: String,
  sold: Boolean,
  price: {
    type: Number,
    required: function() {
      return this.sold
    }
  },
  year: {
    type: Number,
    min: 2000,
    max: 2030
  },
  extras: [String],
  date: {
    type: Date,
    default: Date.now
  }
})

const Car = mongoose.model('car', carShema)

// GET
router
  .get('/list', (req, res) => {
    res.send(['BMW X1', 'AUDI A3', 'Mercedes Clase A'])
  });

router
  .get('/id/:id', (req, res) => {
    const { id } = req.params;
    res.send(id);
  });

router
  .get('/:company/:model', (req, res) => {
    res.send(req.params);
  });

router
  .get('/', (req, res) => {
    res.send(coches);
  });

router
  .get('/:company', (req, res) => {
    const { company } = req.params;
    const coche = coches.find(coche => (
      coche.company === company
    ))

    if (!coche) {
      res.status(404).send({
        message: 'No tenemos ningun coche de esa marca'
      })
    } else {
      res.send(coche)
    }
  });

// POST
router
  .post('/', (req, res) => {
    let cardId = coches.length;
    const { company, model, year } = req.body;
    let coche = {
      id: cardId,
      company: company,
      model: model,
      year: year
    }
    coches.push(coche);
    res.status(201).send(coche);
  });

router
  .post('/2', (req, res) => {
    const { company, model, year } = req.body;
    if (!company || company.length < 3) {
      res.status(400).send('Introduce la empresa correcta');
      return;
    }

    let cardId = coches.length;
    let coche = {
      id: cardId,
      company: company,
      model: model,
      year: year
    }

    coches.push(coche);
    res.status(201).send(coche);
  });

router
  .post('/3', [
    check('company').isLength({ min: 3 }),
    check('model').isLength({ min: 3 })
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { company, model, year } = req.body;
    let carId = coches.length;
    let coche = {
      _id: carId,
      company: company,
      model: model,
      year: year
    }

    coches.push(coche);
    res.status(201).send(coche);
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