import User from '../Models/User.model.js'
import { validationResult } from 'express-validator'

// @desc    Register a new User
// @rout    POST /api/user/register
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
        const { firstName, lastName, email, designation, dateOfBirth, active } = req.body
        const user = await new User({
            firstName,
            lastName,
            email,
            designation,
            dateOfBirth,
            active
        }).save()
        return res.status(201).json({ Success: "true" , user})
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
    }
}

// @desc    Edit a User
// @rout    POST /api/user/edit
// @acce    Public
export const editUser = async (req, res) => {
    try {
        const { firstName, lastName, email, designation, dateOfBirth, active, _id } = req.body
        let user = await User.findById(_id)
        if (!user) return res.status(400).send("User Data Not Found")
        user.firstName = firstName ? firstName : user.firstName
        user.lastName = lastName ? lastName : user.lastName
        user.email = email ? email : user.email
        user.designation = designation ? designation : user.designation
        user.dateOfBirth = dateOfBirth ? dateOfBirth : user.dateOfBirth
        user.active = active ? active : user.active
        user = await user.save()
        return res.status(200).json({ Success: "true" })
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
    }
}

// @desc    Deactivate a User
// @rout    POST /api/user/deactivate
// @acce    Public
export const deactivateUser = async (req, res) => {
    try {
        const { _id } = req.body
        let user = await User.findById(_id)
        if (!user) return res.status(400).send("User Data Not Found")
        user.active = user.active ? false : true
        user = await user.save()
        return res.status(200).json({ Success: "true" })
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
    }
}

// @desc    Get All Users in the DB
// @rout    GET /api/user
// @acce    Public
export const getAllUsers = async (req, res) => {
    console.log("here");
    try {
        let users = await User.find({})
        return res.status(200).json(users)
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
    }
}

// @desc    Get User according To Id
// @rout    GET /api/user/:id
// @acce    Public
export const getUserById = async (req, res) => {
    const {id}=req.params
    try {
        let user = await User.findById(id)
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
    }
}

// @desc    Get All Users in the DB
// @rout    DELETE /api/user
// @acce    Public
export const deleteUser = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await User.findById(id)
        if (!user) return res.status(400).send("User Data Not Found")
        await User.deleteOne({ _id: id })
        return res.status(200).json({ Success: "true" })
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
    }
}