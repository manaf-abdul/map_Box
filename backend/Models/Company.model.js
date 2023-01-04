import mongoose from 'mongoose'

const CompanyModel = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null,
            required: true
        },
        address: {
            type: String,
            default: null,
            required: true
        },
        location: {
            lat:{
                type: String,
                required: true
            },
            long:{
                type: String,
                required: true
            },
            name:{
                type: String,
                required: true
            }
        },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    }, {
    timestamps: true
}
)

const Company = mongoose.model("Company", CompanyModel)
export default Company