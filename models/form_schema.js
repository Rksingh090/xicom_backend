const { model, Schema } = require("mongoose");

const registerSchema = new Schema({

    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    residential_address: {
        street_1: {
            type: String,
            required: true
        },
        street_2: {
            type: String,
            required: true
        }
    },
    same_addresses: {
        type: Boolean
    },
    permanent_address: {
        street_1: {
            type: String
        },
        street_2: {
            type: String
        }
    },
    files: [
        {
            file_name: {
                type: String,
                required: true
            },
            file_type: {
                type: String,
                required: true
            },
            file_url: {
                type: String,
                required: true
            }
        }
    ]

}, {
    timestamps: true
})


module.exports = model("RegisterForm", registerSchema)