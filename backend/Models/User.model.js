import mongoose from 'mongoose'

const userModel = new mongoose.Schema(
    {
        firstName: {
            type: String,
            default: null,
            required: true
        },
        lastName: {
            type: String,
            default: null,
            required: true
        },
        email: {
            type: String,
            default: null,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            trim: true,
            lowercase: true
        },
        designation: {
            type: String,
            default: null,
            required: true
        },
        dateOfBirth: {
            type: String,
            default: null,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        }
    }, {
    timestamps: true
}
)

const User = mongoose.model("User", userModel)
export default User