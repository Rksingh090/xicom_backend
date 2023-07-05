const router = require("express").Router();
const multer = require('multer');
const RegisterForm = require("./models/form_schema");
const form_schema = require("./models/form_schema");

const formidable = require("formidable")


// configure storage 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files');
    },
    filename: function (req, file, cb) {
        let filesplits = file.originalname.split(".")

        cb(null, filesplits[0] + '_' + Date.now() + "." + filesplits[1]);
    }
});

// upload limit 
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
});


// add form 
router.post("/", upload.array("files_array", 10), async (req, res) => {
    try {

        const allFiles = req.files;
        let filesData = req.body.files;

        const validatefields = validateData(req, res);

        if (validatefields.status === "error") {
            return res.status(400).json({
                message: validatefields.message,
                status: "error"
            });
        }

        if (allFiles.length !== filesData.length) {
            return res.status(200).json({
                message: "Invalid Data",
                status: "error"
            });
        }

        for (let i = 0; i < filesData.length; i++) {
            const element = filesData[i];
            element.file_url = `http://localhost:4000/${allFiles[i].filename}`
        }

        const register = new RegisterForm({
            ...req.body,
            files: filesData
        })

        await register.save();

        return res.status(200).json({
            message: "Registration successful",
            status: "success",
        });


    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "error"
        })
    }
})

router.get("/", async (req, res) => {
    try {
        const registerForms = await RegisterForm.find({});

        return res.status(200).json({
            message: "Registration fetched",
            status: "success",
            register_data: registerForms
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "error"
        })
    }
})

function validateData(req, res) {
    const { same_addresses, permanent_address, dob, residential_address, files } = req.body;

    let requiredFields = ["first_name", "last_name", "email", "dob"];

    // check the required data is not null 
    for (let i = 0; i < requiredFields.length; i++) {
        const element = requiredFields[i];
        if (!req.body[element] || String(req.body[element]).trim() === "") {
            return {
                message: `${element} is required`,
                status: "error"
            }
        }
    }

    // check residential data is filled 
    if (
        !residential_address?.street_1 || !residential_address?.street_2 ||
        String(residential_address?.street_1).trim() === "" || String(residential_address?.street_2).trim() === "" ||
        residential_address?.street_1 === undefined || residential_address?.street_2 === undefined
    ) {
        return {
            message: "Residential Address is required.",
            status: "error"
        }
    }

    // check if same address is checked 
    if (!same_addresses) {
        // if not permanent address is required  
        if (
            !permanent_address?.street_1 || !permanent_address?.street_2 ||
            String(permanent_address?.street_1).trim() === "" || String(permanent_address?.street_2).trim() === "" ||
            permanent_address?.street_1 === undefined || permanent_address?.street_2 === undefined
        ) {
            return {
                message: "Permanent Address is require if both residential address address is same.",
                status: "error"
            }
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
        return {
            message: "Age should be greater than 18",
            status: "error"
        }
    }

    // check if one file is there 
    if (!files || files?.length <= 1) {
        return {
            message: "Atleast two files are required",
            status: "error"
        }
    }

    // for each files object validate the file_name, file_type, file_url  
    for (let i = 0; i < files.length; i++) {
        const element = files[i];
        if (!element.file_name || element.file_name === undefined || element.file_name === "") {
            return {
                message: "File Name is required",
                status: "error"
            }
        }
        if (!element.file_type || element.file_type === undefined || element.file_type === "") {
            return {
                message: "File type is required",
                status: "error"
            }
        }
    }

    return {
        status: "success"
    }
}

module.exports = router;