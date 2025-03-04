import express from 'express';
import mongoose from 'mongoose';
import ejs from "ejs"

import { Employees } from './models/Employees.mjs';
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs")
let conn = await mongoose.connect("mongodb://localhost:27017/employee")

app.get("/", (req, res) => {
        res.render("index");
})
app.post("/add", async (req, res) => {
        try {
                let employeeData = req.body
                console.log("Employee Data" ,  employeeData);
                let addEmployee = new Employees(employeeData)
                let data = await addEmployee.save()
                console.log( "Employee Added Successfully" , data);
                res.json({ success: true, message: "Employee Added Successfully", data })
                
        } catch (err) {
                console.log(err)
                res.json({ success: false, message: "Error Adding Employee", err })
        }
})

app.get("/employees", async (req, res) => {
        try {
                let getEmployees = await Employees.find(); // Await the database query
                console.log("Employees Get Successfully" , getEmployees);
                
                res.render("employees" , { employees: getEmployees });
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
                console.log("By ID Employees Get Successfully" , getEmployeeById);
                if(!getEmployeeById){
                        return res.status(404).json({ success: false, message: "Employee Not Found"})
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
                let updateEmloyeeById = await Employees.findByIdAndUpdate(req.params.id , req.body, {new : true} );
                res.json({ success: true, message: "Employee Updated Successfully", updateEmloyeeById : updateEmloyeeById })
        } catch (err) {
                console.log("Error Occured", err.message);
                res.status(500).json({ success: false, message: "Error updating employees" });
        }
})

app.delete("/delete", async (req, res) => {
        try {
                let deleteEmployee = await Employees.deleteOne();
                res.json({ success: true, message: "Employee Deleted Successfully", deleteEmployee : deleteEmployee })
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
