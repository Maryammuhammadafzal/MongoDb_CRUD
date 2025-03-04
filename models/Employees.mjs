
import mongoose from "mongoose";

const employeesSchema = new mongoose.Schema({
        firstName: String,
        lastName: String,
        company: String,
        address: String,
        email: String,
        department: String,
        profileImage : String

      });

      export const Employees = mongoose.model('Employees', employeesSchema); 