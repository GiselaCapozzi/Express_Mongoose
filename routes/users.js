const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { check, validationResult } = require('express-validator');

router
  .get('/', async (req, res) => {
    const users = await User
      .find()
    // if(!users) return res.status(204).send('Aun no hay usuarios')

    res.send(users);
  })

router
  .get('/:id', async (req, res) => {
    const { id } = req.params;

    const user = await User
      .findById(id)

    if (!user) return res.status(404).send('No hemos encontrado un usuario con ese ID')
    res.send(user)
  })

router
  .post('/', [
    check('name').isLength({ min: 3 }),
    check('email').isLength({ min: 3 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, isCustomer, email, password } = req.body;
    const user = new User({
      name: name,
      isCustomer: isCustomer,
      email: email,
      password: password
    })

    const result = await user.save();
    res.status(201).send(result);
  });

router
  .put('/:id', [
    check('name').isLength({ min: 3 }),
    check('email').isLength({ min: 3 })
  ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name, isCustomer, email, password } = req.body;
      const user = await User
        .findByIdAndUpdate(id, {
          name: name,
          isCustomer: isCustomer,
          email: email,
          password: password
        },
          {
            new: true
          })

      if (!user) {
        return res.status(404).send('El usuario con ese ID no existe')
      }

      res.status(204).send();
    })

router
    .delete('/:id', async(req, res) => {
      const { id } = req.params;
      const user = await User
        .findByIdAndDelete(id)
      
        if(!user) return res.status(404).send('El usuario con ese ID no se encuentra');

        res.status(200).send('Usuario borrado')
    })

module.exports = router;