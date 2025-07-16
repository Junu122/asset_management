import express from 'express';
import {addEmployee,viewALLEmployees,viewEditEmployee,editEmployee,viewAddEmployee} from '../controller/employeeController.js';



const employeeRouter=express.Router();


employeeRouter.post('/addemployee',addEmployee);
employeeRouter.get('/viewallemployees',viewALLEmployees);
employeeRouter.get('/viewEditEmployee/:id',viewEditEmployee);
employeeRouter.post('/editEmployee/:id',editEmployee)
employeeRouter.get('/addEmployee',viewAddEmployee)

export default employeeRouter