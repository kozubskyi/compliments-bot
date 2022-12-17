const { Router } = require('express');
const HttpErrors = require('http-errors');
const ComplimentModel = require('../models/compliment');

const complimentsController = Router();

complimentsController.get('/', async (req, res, next) => {
  try {
    const compliments = await ComplimentModel.find();

    res.status(200).send(compliments);
  } catch (err) {
    next(err);
  }
});

complimentsController.get('/:id', async (req, res, next) => {
  try {
    const compliment = await ComplimentModel.findById(req.params.id);

    res.status(200).send(compliment);
  } catch (err) {
    next(err);
  }
});

complimentsController.get('/text/:text', async (req, res, next) => {
  try {
    const compliment = await ComplimentModel.findOne(req.params);

    res.status(200).send(compliment);
  } catch (err) {
    next(err);
  }
});

complimentsController.post('/', async (req, res, next) => {
  try {
    const existing = await ComplimentModel.findOne(req.body);

    if (existing) throw new HttpErrors.Conflict(`Компліментик з таким текстом вже є у базі даних`);

    const newCompliment = await ComplimentModel.create(req.body);

    res.status(201).send(newCompliment);
  } catch (err) {
    next(err);
  }
});

complimentsController.post('/all', async (req, res, next) => {
  try {
    const newCompliments = await ComplimentModel.create(req.body);

    res.status(201).send(newCompliments);
  } catch (err) {
    next(err);
  }
});

complimentsController.patch('/:id', async (req, res, next) => {
  try {
    const updatedCompliments = await ComplimentModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).send(updatedCompliments);
  } catch (err) {
    next(err);
  }
});

complimentsController.patch('/sendings/reset', async (req, res, next) => {
  try {
    const updatedCompliments = await ComplimentModel.updateMany({}, { sendings: 0 }, { new: true });

    res.status(200).send(updatedCompliments);
  } catch (err) {
    next(err);
  }
});

complimentsController.delete('/id/:id', async (req, res, next) => {
  try {
    const deletedCompliments = await ComplimentModel.findByIdAndDelete(req.params.id);

    res.status(200).send(deletedCompliments);
  } catch (err) {
    next(err);
  }
});

complimentsController.delete('/text/:text', async (req, res, next) => {
  try {
    const deletedCompliments = await ComplimentModel.findOneAndDelete({ text: req.params.text });

    res.status(200).send(deletedCompliments);
  } catch (err) {
    next(err);
  }
});

complimentsController.delete('/', async (req, res, next) => {
  try {
    const deletedCompliments = await ComplimentModel.deleteMany();

    res.status(200).send(deletedCompliments);
  } catch (err) {
    next(err);
  }
});

module.exports = complimentsController;
