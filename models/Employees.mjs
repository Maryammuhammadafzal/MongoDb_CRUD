
import mongoose from "mongoose";

const employeesSchema = new mongoose.Schema({
        firstName:  { type: String, required: true },
        lastName:  { type: String, required: true },
        company:  { type: String, required: true },
        address:  { type: String, required: true },
        email:  { type: String, required: true },
        department:  { type: String, required: true },
        profileImage :  { type: String, required: true }

      });

      export const Employees = mongoose.model('Employees', employeesSchema); 