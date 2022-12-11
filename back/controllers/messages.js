const { Router } = require('express')
const MessageModel = require('../models/message')
const HttpErrors = require('http-errors')
const { createDate } = require('../helpers')

const messagesController = Router()

messagesController.get('/', async (req, res, next) => {
  try {
    const messages = await MessageModel.find()

    res.status(200).send(messages)
  } catch (err) {
    next(err)
  }
})

messagesController.get('/:type', async (req, res, next) => {
  try {
    const messages = await MessageModel.find({ type: req.params.type })

    res.status(200).send(messages)
  } catch (err) {
    next(err)
  }
})

messagesController.get('/:type/:for', async (req, res, next) => {
  try {
    const messages = await MessageModel.find({ type: req.params.type, for: {} /* содержит в массиве for */ })

    res.status(200).send(messages)
  } catch (err) {
    next(err)
  }
})

messagesController.get('/:id', async (req, res, next) => {
  try {
    const message = await MessageModel.findById(req.params.id)

    res.status(200).send(message)
  } catch (err) {
    next(err)
  }
})

messagesController.post('/', async (req, res, next) => {
  try {
    const existing = await MessageModel.findOne(req.body)

    if (existing) {
      const message = `Повідомлення формату ${req.body} вже є у базі даних`

      throw new HttpErrors.Conflict(message)
      // 👇 Нижній варіант ідентичний верхньому
      // res.status(409).send({ message })
    }

    const newMessage = await MessageModel.create({ ...req.body, created: createDate() })

    res.status(201).send(newMessage)
  } catch (err) {
    next(err)
  }
})

messagesController.post('/all', async (req, res, next) => {
  try {
    const newMessages = await MessageModel.create(
      req.body.map((compliment) => ({ ...compliment, created: createDate() }))
    )

    res.status(201).send(newMessages)
  } catch (err) {
    next(err)
  }
})

messagesController.patch('/:id', async (req, res, next) => {
  try {
    const updatedMessage = await MessageModel.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).send(updatedMessage)
  } catch (err) {
    next(err)
  }
})

messagesController.delete('/:id', async (req, res, next) => {
  try {
    const deletedMessages = await MessageModel.findByIdAndDelete(req.params.id)

    res.status(200).send(deletedMessages)
  } catch (err) {
    next(err)
  }
})

messagesController.delete('/text/:text', async (req, res, next) => {
  try {
    const deletedMessages = await MessageModel.findOneAndDelete({ text: req.params.text })

    res.status(200).send(deletedMessages)
  } catch (err) {
    next(err)
  }
})

messagesController.delete('/type/:type', async (req, res, next) => {
  try {
    const deletedCompliments = await MessageModel.deleteMany({ type: req.params.type })

    res.status(200).send(deletedCompliments)
  } catch (err) {
    next(err)
  }
})

messagesController.delete('/', async (req, res, next) => {
  try {
    const deletedCompliments = await MessageModel.deleteMany()

    res.status(200).send(deletedCompliments)
  } catch (err) {
    next(err)
  }
})

module.exports = messagesController
