import { validationResult } from 'express-validator';
import Company from '../Models/Company.model.js'
import User from '../Models/User.model.js'
import Axios from 'axios'

// @desc    Register a new company
// @rout    POST /api/company/register
// @acce    Public
export const register = async (req, res) => {
    console.log(req.body);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(400).json(errs);
        }
        const { name, address, location } = req.body
        console.log(req.body)
        // if (location) {
        //     try {
        //         const { data } = await Axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${process.env.mapbox_acces_token}`)
        //         lat = data.features[0].geometry.coordinates[0],
        //             long = data.features[0].geometry.coordinates[1]
        //     } catch (error) {
        //         console.log(error)
        //         return res.status(400).send(error.message)
        //     }
        // }

        let company = await new Company({
            name,
            address,
            location: {
                lat: location.geometry.coordinates[0],
                long: location.geometry.coordinates[1],
                name: location.text
            }
        }).save()
        return res.status(201).json({ Success: "true" })
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
    }
}

// @desc    Edit a company
// @rout    POST /api/company/edit
// @acce    Public
export const editcompany = async (req, res) => {
    try {
        const { name, address, location, _id } = req.body
        console.log(req.body)
        let company = await Company.findById(_id)
        if (!company) return res.status(400).send("company Data Not Found")
        company.name = name ? name : company.name
        company.address = address ? address : company.address
        company.location.name = location && location.geometry ? location.text : company.location.name
        company.location.lat = location && location.geometry && location.geometry.coordinates[0] ? location.geometry.coordinates[0] : company.location.lat
        company.location.long = location && location.geometry && location.geometry.coordinates[1] ? location.geometry.coordinates[1] : company.location.long
        company = await company.save()
        return res.status(200).json({ Success: "true" })
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
    }
}

// @desc    Get All companys in the DB
// @rout    GET /api/company
// @acce    Public
export const getAllcompanys = async (req, res) => {
    console.log("here");
    try {
        let companies = await Company.find({})
        return res.status(200).json(companies)
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
    }
}


// @desc    Get All companys in the DB
// @rout    DELETE /api/form
// @acce    Public
export const deletecompany = async (req, res) => {
    try {
        let { id } = req.params;
        let company = await Company.findById(id)
        if (!company) return res.status(400).send("company Data Not Found")
        await company.deleteOne({ _id: id })
        return res.status(200).json({ Success: "true" })
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
    }
}


// @desc    Get Company according To Id
// @rout    GET /api/company/:id
// @acce    Public
export const getCompanyById = async (req, res) => {
    const { id } = req.params
    console.log("id", id)
    try {
        let company = await Company.findById(id).populate("users")
        return res.status(200).json(company)
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
    }
}


// @desc    Add/Remove a User To Company
// @rout    POST /api/company/add-or-remove-user
// @acce    Public
export const addOrRemoveUserCompanys = async (req, res) => {
    try {
        const { userId, companyId } = req.body
        let company = await Company.findById(companyId)
        if (!company) return res.status(400).send("company Data Not Found")
        let user = await User.findById(userId)
        if (!user) return res.status(400).send("user Data Not Found")
        if (company.users.includes(userId)) {
            await Company.updateOne({ _id: companyId }, { $pull: { users: userId } })
        } else {
            await Company.updateOne({ _id: companyId }, { $push: { users: userId } })
        }
        return res.status(200).json({ Success: "true" })
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
    }
}

// @desc    Add/Remove a User To Company
// @rout    POST /api/company/add-or-remove-user
// @acce    Public
export const migrateCompany = async (req, res) => {
    try {
        const { fromCompanyId, userId, toCompanyId } = req.body
        console.log(req.body)
        let company = await Company.findById(fromCompanyId)
        if (!company) return res.status(400).send("company Data Not Found")
        let user = await User.findById(userId)
        if (!user) return res.status(400).send("user Data Not Found")
        if (company.users.includes(userId)) {
            await Company.updateOne({ _id: fromCompanyId }, { $pull: { users: userId } })
            await Company.updateOne({ _id: toCompanyId }, { $push: { users: userId } })
            return res.status(200).json({ Success: "true" })
        } else {
            return res.status(400).json("User Not Present in Current Company")
        }
    } catch (error) {
        console.log("error migrate", error);
        return res.status(400).send(error.message)
    }
}