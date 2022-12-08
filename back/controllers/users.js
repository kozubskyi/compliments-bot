const { Router } = require("express")
const UserModel = require("../models/user")
const HttpErrors = require("http-errors")

const usersController = Router()

usersController.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find()

    res.status(200).send(users)
  } catch (err) {
    next(err)
  }
})

usersController.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await UserModel.findById(id)

    if (!user) throw new HttpErrors.NotFound(`Користувача з id ${id} немає у базі даних`)

    res.status(200).send(user)
  } catch (err) {
    next(err)
  }
})

usersController.get("/chatId/:chatId", async (req, res, next) => {
  try {
    const { chatId } = req.params

    const user = await UserModel.findOne({ chatId })

    if (!user) throw new HttpErrors.NotFound(`Користувача з чатом ${chatId} немає у базі даних`)

    res.status(200).send(user)
  } catch (err) {
    next(err)
  }
})

usersController.post("/", async (req, res, next) => {
  try {
    const { firstName, lastName, username, chatId, messages = 1, groups = ["others"] } = req.body

    const existingUser = await UserModel.findOne({ username })

    if (existingUser) throw new HttpErrors.Conflict(`Користувач з username ${username} вже є у базі даних`)

    const newUser = await UserModel.create({ firstName, lastName, username, chatId, groups })

    res.status(201).send(newUser)
  } catch (err) {
    next(err)
  }
})

usersController.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params

    const deletedUser = await UserModel.findByIdAndDelete(id)

    if (!deletedUser) throw new HttpErrors.NotFound(`Користувача з id ${id} немає у базі даних`)

    res.status(200).send(deletedUser)
  } catch (err) {
    next(err)
  }
})

usersController.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params

    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true })

    if (!updatedUser) throw new HttpErrors.NotFound(`Користувача з id ${id} немає у базі даних`)

    res.status(200).send(updatedUser)
  } catch (err) {
    next(err)
  }
})

module.exports = usersController

