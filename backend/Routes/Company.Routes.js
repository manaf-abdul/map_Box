import express from "express";
import { register, editcompany, deletecompany, getAllcompanys, addOrRemoveUserCompanys,getCompanyById, migrateCompany } from "../Controllers/Company.Controller.js";
const router = express.Router()
import { company } from "../middleware/validator.js";

router.post("/add-or-remove-user",company("addOrRemove"), addOrRemoveUserCompanys)
router.post("/migrate",company("migrate"), migrateCompany)
router.post("/register", company("register"), register)
router.post("/edit", editcompany)
router.get("/:id", getCompanyById)
router.get("/", getAllcompanys)
router.delete("/:id", deletecompany)

export default router