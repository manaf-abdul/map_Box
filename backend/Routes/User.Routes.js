import express from "express";
const router = express.Router()
import { deactivateUser, deleteUser, editUser, getAllUsers, getUserById, register } from '../Controllers/User.Controller.js'
import { users } from "../middleware/validator.js";

router.post("/register", users("register"), register)
router.post("/edit", editUser)
router.post("/status", deactivateUser)
router.get("/:id", getUserById)
router.get("/", getAllUsers)
router.delete("/:id", deleteUser)

export default router