const router = require("express").Router();
const RegisterForm = require("./models/form_schema");


// add form 
router.post("/", validateData, async (req, res) => {
    try {
        const newRegister = new RegisterForm(req.body);
        newRegister.save()

        return res.status(200).json({
            message: "Registration successful",
            status: "success",
            formdata: newRegister
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "error"
        })
    }
})


function validateData(req, res, next) {
    const { same_addresses, permanent_address, dob, residential_address, files } = req.body;

    let requiredFields = ["first_name", "last_name", "email", "dob"];


    // check the required data is not null 
    for (let i = 0; i < requiredFields.length; i++) {
        const element = requiredFields[i];
        if (!req.body[element]) {
            return res.status(400).json({
                message: `${element} is required`,
                status: "error"
            })
        }
    }

    // check residential data is filled 
    if (
        !residential_address?.street_1 || !residential_address?.street_2 ||
        residential_address?.street_1 === "" || residential_address?.street_2 === "" ||
        residential_address?.street_1 === undefined || residential_address?.street_2 === undefined
    ) {
        return res.status(500).json({
            message: "Residential Address is required.",
            status: "error"
        })
    }

    // check if same address is checked 
    if (!same_addresses) {
        // if not permanent address is required  
        if (
            !permanent_address?.street_1 || !permanent_address?.street_2 ||
            permanent_address?.street_1 === "" || permanent_address?.street_2 === "" ||
            permanent_address?.street_1 === undefined || permanent_address?.street_2 === undefined
        ) {
            return res.status(500).json({
                message: "Permanent Address is require if both residential address address is same.",
                status: "error"
            })
        }
    }

    // data difference calculate in millisecond 
    const currentData = new Date();
    const dobDate = new Date(dob);

    const diffInMilliseconds = currentData - dobDate;
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;

    // miliseconds to year 
    const diffInYears = diffInMilliseconds / millisecondsPerYear;

    // check age is greater than 18 or not 
    if (diffInYears < 18) {
        return res.status(400).json({
            message: "Age should be greater than 18",
            status: "error"
        })
    }

    // check if one file is there 
    if (!files || files?.length <= 0) {
        return res.status(400).json({
            message: "Atleast one file is required",
            status: "error"
        })
    }

    // for each files object validate the file_name, file_type, file_url  
    for (let i = 0; i < files.length; i++) {
        const element = files[i];
        if (!element.file_name || element.file_name === undefined || element.file_name === "") {
            return res.status(400).json({
                message: "File Name is required",
                status: "error"
            })
        }
        if (!element.file_type || element.file_type === undefined || element.file_type === "") {
            return res.status(400).json({
                message: "File type is required",
                status: "error"
            })
        }
        if (!element.file_url || element.file_url === undefined || element.file_url === "") {
            return res.status(400).json({
                message: "File url is required",
                status: "error"
            })
        }
    }

    next();
}

module.exports = router;