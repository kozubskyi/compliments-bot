const { Router } = require('express');
const HttpErrors = require('http-errors');
const MessageModel = require('../models/message');
const createDate = require('../helpers/create-date');

const messagesController = Router();

messagesController.get('/', async (req, res, next) => {
  try {
    const messages = await MessageModel.find();

    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
});

messagesController.get('/type/:type', async (req, res, next) => {
  try {
    const messages = await MessageModel.find({ type: req.params.type });

    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
});

messagesController.get('/for/:for', async (req, res, next) => {
  try {
    const messages = await MessageModel.find({ for: req.params.for });

    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
});

messagesController.get('/:type/:for', async (req, res, next) => {
  try {
    const messages = await MessageModel.find(req.params);
    // ! В нашем случае поле for элементов в базе данных является массивом, но Монго так работает, что даже если мы в него передаем просто строку, то Монго сама делает проверку типо "имеет ли этот массив элемент со значением этой сроки"

    // if (!messages.length)
    //   throw new HttpErrors.NotFound(
    //     `Повідомлень з параметрами ${JSON.stringify(req.params)} не знайдено у базі даних`
    //   );

    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
});

messagesController.get('/:id', async (req, res, next) => {
  try {
    const message = await MessageModel.findById(req.params.id);

    res.status(200).send(message);
  } catch (err) {
    next(err);
  }
});

messagesController.post('/', async (req, res, next) => {
  try {
    const existing = await MessageModel.findOne(req.body);

    if (existing) {
      const text = `Повідомлення формату ${req.body} вже є у базі даних`;

      throw new HttpErrors.Conflict(text);
      // 👇 Нижній варіант ідентичний верхньому
      // res.status(409).send({ message: text })
    }

    const newMessage = await MessageModel.create({ ...req.body, created: createDate() });

    res.status(201).send(newMessage);
  } catch (err) {
    next(err);
  }
});

messagesController.post('/all', async (req, res, next) => {
  try {
    const newMessages = await MessageModel.create(
      req.body.map(msg => ({ ...msg, created: createDate() }))
    );

    res.status(201).send(newMessages);
  } catch (err) {
    next(err);
  }
});

messagesController.patch('/:id', async (req, res, next) => {
  try {
    const updatedMessage = await MessageModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).send(updatedMessage);
  } catch (err) {
    next(err);
  }
});

messagesController.patch('/reset/sendings', async (req, res, next) => {
  try {
    const updatedMessage = await MessageModel.updateMany({}, { sendings: 0 }, { new: true });

    res.status(200).send(updatedMessage);
  } catch (err) {
    next(err);
  }
});

messagesController.delete('/id/:id', async (req, res, next) => {
  try {
    const deletedMessage = await MessageModel.findByIdAndDelete(req.params.id);

    res.status(200).send(deletedMessage);
  } catch (err) {
    next(err);
  }
});

messagesController.delete('/text/:text', async (req, res, next) => {
  try {
    const deletedMessage = await MessageModel.findOneAndDelete({ text: req.params.text });

    console.log(req.params);

    res.status(200).send(deletedMessage);
  } catch (err) {
    next(err);
  }
});

messagesController.delete('/type/:type', async (req, res, next) => {
  try {
    const deletedMessages = await MessageModel.deleteMany({ type: req.params.type });

    res.status(200).send(deletedMessages);
  } catch (err) {
    next(err);
  }
});

messagesController.delete('/', async (req, res, next) => {
  try {
    const deletedMessages = await MessageModel.deleteMany();

    res.status(200).send(deletedMessages);
  } catch (err) {
    next(err);
  }
});

module.exports = messagesController;
