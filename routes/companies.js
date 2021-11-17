const express = require('express');
const router = express.Router();
const Company = require('../models/company');

router
  .get('/', async (req, res) => {
    const companies = await Company
      .find()
    if (!companies) return res.status(204).send('No hay fabricantes en la BD')

    res.send(companies);
  })

router
  .get('/:id', async (req, res) => {
    const { id } = req.params;

    const company = await Company
      .findById(id)

    if (!company) return res.status(404).send('No existe fabricante con ese ID')

    res.status(300).send(company);
  });

router
  .post('/', async (req, res) => {
    const { name, country } = req.body;
    const company = new Company({
      name,
      country
    })

    const result = await company.save();
    res.status(201).send(result)
  })

router
  .put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, country } = req.body;

    const company = await Company
      .findByIdAndUpdate(id, {
        name,
        country
      },
        {
          new: true
        })

    if (!company) return res.status(404).send('No existe un fabricante con ese ID');

    res.status(204).send('Actualizada correctamente')
  })

router
  .delete('/:id', async (req, res) => {
    const { id } = req.params;

    const company = await Company
      .findByIdAndDelete(id);

    if(!company) return res.status(404).send('No hay fabricante con ese ID');

    res.status(200).send('Fabricante borrado')
  })

module.exports = router;