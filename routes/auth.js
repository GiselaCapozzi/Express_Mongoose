const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router
  .post('/', async (req, res) => {
    const { email, password } = req.body;

    let user = await User
      .findOne({ email })
    if (!user) return res.status(400).send('Usuario o contraseña incorrectos')

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword) return res.status(400).send('Usuario o contraseña incorrectos');

    res.send('Usuario y contraseña correcta')
  })

module.exports = router;