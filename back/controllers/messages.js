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

messagesController.get('/:type/:status', async (req, res, next) => {
  const { type, status } = req.params

  try {
    const messages = await MessageModel.find({ type, for: /* содержит в массиве status */})

    res.status(200).send(messages)
  } catch (err) {
    next(err)
  }
})

messagesController.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    const compliment = await MessageModel.findById(id)

    if (!compliment) throw new HttpErrors.NotFound(`Компліментика з id ${id} немає у базі даних`)

    res.status(200).send(compliment)
  } catch (err) {
    next(err)
  }
})

messagesController.post('/', async (req, res, next) => {
  try {
    const { text } = req.body

    const existing = await MessageModel.findOne({ text, for: req.body.for })

    if (existing) {
      const message = `Компліментик формату { text: '${text}', for: '${req.body.for}' } вже є у базі даних`

      throw new HttpErrors.Conflict(message)
      // 👇 Нижній варіант ідентичний верхньому
      // res.status(409).send({ message })
    }

    const newCompliment = await MessageModel.create({ ...req.body, created: createDate() })

    res.status(201).send(newCompliment)
  } catch (err) {
    next(err)
  }
})

messagesController.post('/all', async (req, res, next) => {
  try {
    const newCompliments = await MessageModel.create(
      req.body.map((compliment) => ({ ...compliment, created: createDate() }))
    )

    res.status(201).send(newCompliments)
  } catch (err) {
    next(err)
  }
})

messagesController.patch('/:id', async (req, res, next) => {
  try {
    const updatedCompliment = await MessageModel.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).send(updatedCompliment)
  } catch (err) {
    next(err)
  }
})

messagesController.delete('/id/:id', async (req, res, next) => {
  try {
    const deletedCompliment = await MessageModel.findByIdAndDelete(req.params.id)

    res.status(200).send(deletedCompliment)
  } catch (err) {
    next(err)
  }
})

messagesController.delete('/text/:text', async (req, res, next) => {
  try {
    const deletedCompliment = await MessageModel.findOneAndDelete({ text: req.params.text })

    res.status(200).send(deletedCompliment)
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
