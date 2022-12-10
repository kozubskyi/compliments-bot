const { Router } = require('express');
const ComplimentModel = require('../models/compliment');
const HttpErrors = require('http-errors');
const { createDate } = require('../helpers');

const complimentsController = Router();

complimentsController.get('/', async (req, res, next) => {
  try {
    const compliments = await ComplimentModel.find();

    res.status(200).send(compliments);
  } catch (err) {
    next(err);
  }
});

complimentsController.get('/:for', async (req, res, next) => {
  try {
    const compliments = await ComplimentModel.find({ for: req.params.for });

    res.status(200).send(compliments);
  } catch (err) {
    next(err);
  }
});

complimentsController.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const compliment = await ComplimentModel.findById(id);

    if (!compliment) throw new HttpErrors.NotFound(`Компліментика з id ${id} немає у базі даних`);

    res.status(200).send(compliment);
  } catch (err) {
    next(err);
  }
});

complimentsController.post('/', async (req, res, next) => {
  try {
    const newCompliment = await ComplimentModel.create({ ...req.body, created: createDate() });

    res.status(201).send(newCompliment);
  } catch (err) {
    next(err);
  }
});

complimentsController.post('/all', async (req, res, next) => {
  try {
    const newCompliments = await ComplimentModel.create(
      req.body.map(compliment => ({ ...compliment, created: createDate() }))
    );

    res.status(201).send(newCompliments);
  } catch (err) {
    next(err);
  }
});

complimentsController.patch('/:id', async (req, res, next) => {
  try {
    const updatedCompliment = await ComplimentModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).send(updatedCompliment);
  } catch (err) {
    next(err);
  }
});

complimentsController.delete('/:id', async (req, res, next) => {
  try {
    const deletedCompliment = await ComplimentModel.findByIdAndDelete(req.params.id);

    res.status(200).send(deletedCompliment);
  } catch (err) {
    next(err);
  }
});

complimentsController.delete('/', async (req, res, next) => {
  try {
    const deletedCompliments = await ComplimentModel.deleteMany({});

    res.status(200).send(deletedCompliments);
  } catch (err) {
    next(err);
  }
});

module.exports = complimentsController;
