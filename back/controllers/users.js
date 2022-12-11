const { Router } = require('express')
const UserModel = require('../models/user')
const HttpErrors = require('http-errors')
const { createDate } = require('../helpers')

const usersController = Router()

usersController.get('/', async (req, res, next) => {
  try {
    const users = await UserModel.find()

    res.status(200).send(users)
  } catch (err) {
    next(err)
  }
})

usersController.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await UserModel.findById(id)

    if (!user) throw new HttpErrors.NotFound(`Користувача з id ${id} немає у базі даних`)

    res.status(200).send(user)
  } catch (err) {
    next(err)
  }
})

usersController.get('/chatId/:chatId', async (req, res, next) => {
  try {
    const { chatId } = req.params

    const user = await UserModel.findOne({ chatId })

    // 👇 не потрібна ця строка
    // if (!user) throw new HttpErrors.NotFound(`Користувача з chatId ${chatId} немає у базі даних`)

    res.status(200).send(user)
  } catch (err) {
    next(err)
  }
})

usersController.post('/', async (req, res, next) => {
  try {
    const { chatId } = req.body

    const existingUser = await UserModel.findOne({ chatId })

    if (existingUser) throw new HttpErrors.Conflict(`Користувач з chatId ${chatId} вже є у базі даних`)

    const newUser = await UserModel.create({ ...req.body, created: createDate() })

    res.status(201).send(newUser)
  } catch (err) {
    next(err)
  }
})

usersController.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true })

    if (!updatedUser) throw new HttpErrors.NotFound(`Користувача з id ${id} немає у базі даних`)

    res.status(200).send(updatedUser)
  } catch (err) {
    next(err)
  }
})

usersController.patch('/chatId/:chatId', async (req, res, next) => {
  try {
    const { chatId } = req.params

    const updatedUser = await UserModel.findOneAndUpdate({ chatId }, req.body, { new: true })

    if (!updatedUser) throw new HttpErrors.NotFound(`Користувача з chatId ${chatId} немає у базі даних`)

    res.status(200).send(updatedUser)
  } catch (err) {
    next(err)
  }
})

usersController.patch('/username/:username', async (req, res, next) => {
  try {
    const { username } = req.params

    const updatedUser = await UserModel.findOneAndUpdate({ username }, req.body, { new: true })

    if (!updatedUser) throw new HttpErrors.NotFound(`Користувача з username ${username} немає у базі даних`)

    res.status(200).send(updatedUser)
  } catch (err) {
    next(err)
  }
})

usersController.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    const deletedUser = await UserModel.findByIdAndDelete(id)

    if (!deletedUser) throw new HttpErrors.NotFound(`Користувача з id ${id} немає у базі даних`)

    res.status(200).send(deletedUser)
  } catch (err) {
    next(err)
  }
})

usersController.delete('/chatId/:chatId', async (req, res, next) => {
  try {
    const { chatId } = req.params

    const deletedUser = await UserModel.findOneAndDelete({ chatId })

    if (!deletedUser) throw new HttpErrors.NotFound(`Користувача з chatId ${chatId} немає у базі даних`)

    res.status(200).send(deletedUser)
  } catch (err) {
    next(err)
  }
})

usersController.delete('/username/:username', async (req, res, next) => {
  try {
    const { username } = req.params

    const deletedUser = await UserModel.findOneAndDelete({ username })

    if (!deletedUser) throw new HttpErrors.NotFound(`Користувача з username ${username} немає у базі даних`)

    res.status(200).send(deletedUser)
  } catch (err) {
    next(err)
  }
})

module.exports = usersController
