const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

router
  .get('/', async (req, res) => {
    const users = await User
      .find()
    if(!users) return res.status(204).send('Aun no hay usuarios')

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
  .post('/', async (req, res) => {
    const { name, email, password } = req.body;

    let user = await User
      .findOne({ email: email })
    if(user) return res.status(302).send('Ese usuario ya existe');

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user = new User({
      name: name,
      isCustomer: false,
      email: email,
      password: hashPassword
    })

    const result = await user.save();
    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  });

router
  .put('/:id', async (req, res) => {
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

      res.status(204).send('Actualizado correctamente');
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