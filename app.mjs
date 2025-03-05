import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import ejs from "ejs"
import path from 'path'

import { Employees } from './models/Employees.mjs';
const app = express();

app.use(express.json())
app.use("/uploads", express.static("public/uploads"));
app.use(express.urlencoded({ extended: true }));

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

//  Multer Storage Configuration
const storage = multer.diskStorage({
        destination: function (req, file, cb) {
                cb(null, "public/uploads"); // Save files in public/uploads
        },
        filename: function (req, file, cb) {
                cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
        },
});

const upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
                const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
                if (!allowedTypes.includes(file.mimetype)) {
                        return cb(new Error("Only images (JPG, PNG, GIF) are allowed"), false);
                }
                cb(null, true);
        },
})


app.set("view engine", "ejs")
let conn = await mongoose.connect("mongodb://localhost:27017/employee")

app.get("/", (req, res) => {
        res.render("index");
})
app.post("/add", upload.single("profileImage"), async (req, res) => {
        if (!req.file) {
                return res.json({ success: false, message: "No file uploaded!" });
        } else {


                try {
                        let employeeData = req.body;

                        //  Store uploaded file name in database
                        employeeData.profileImage = req.file.filename;

                        console.log("Employee Data", employeeData);

                        let addEmployee = new Employees(employeeData);
                        let data = await addEmployee.save();

                        console.log("Employee Added Successfully", data);
                        res.json({ success: true, message: "Employee Added Successfully", data });

                } catch (err) {
                        console.log("Error Adding Employee", err);
                        res.json({ success: false, message: "Error Adding Employee", err });
                }
        }
})

app.get("/employees", async (req, res) => {
        try {
                let getEmployees = await Employees.find().sort({ _id: -1 }) // Await the database query
                console.log("Employees Get Successfully", getEmployees);

                res.render("employees", { employees: getEmployees });
        } catch (error) {
                console.error("Error fetching employees:", error);
                res.status(500).json({
                        success: false,
                        message: "Error fetching employees"
                });
        }
})
app.get("/employee/:id", async (req, res) => {
        try {
                let getEmployeeById = await Employees.findById(req.params.id); // Await the database query
                console.log("By ID Employees Get Successfully", getEmployeeById);
                if (!getEmployeeById) {
                        return res.status(404).json({ success: false, message: "Employee Not Found" })
                }
                res.json(getEmployeeById);
        } catch (error) {
                console.error("Error fetching employees:", error);
                res.status(500).json({
                        success: false,
                        message: "Error fetching employee"
                });
        }
})

app.put("/edit/:id", async (req, res) => {
        try {
                let updateEmloyeeById = await Employees.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.json({ success: true, message: "Employee Updated Successfully", updateEmloyeeById: updateEmloyeeById })
        } catch (err) {
                console.log("Error Occured", err.message);
                res.status(500).json({ success: false, message: "Error updating employees" });
        }
})

app.delete("/delete", async (req, res) => {
        try {
                let deleteEmployee = await Employees.deleteOne();
                res.json({ success: true, message: "Employee Deleted Successfully", deleteEmployee: deleteEmployee })
        } catch (err) {
                console.log("Error Occured", err.message);
                res.status(500).json({ success: false, message: "Error deleting employees" });
        }
})



app.delete("/deleteAll", async (req, res) => {
        try {
                let deleteEmployee = await Employees.deleteMany();
                res.json({ success: true, message: "Employee Deleted Successfully", deletedCount: deleteEmployee.deletedCount })
        } catch (err) {
                console.log("Error Occured", err.message);
                res.status(500).json({ success: false, message: "Error deleting employees" });
        }
})


app.listen(3000)
