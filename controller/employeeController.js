import Employee from "../model/employeeModel.js";

const addEmployee = async (req, res) => {
  try {
    const { name, position, isActive } = req.body;

    const newEmployee = await Employee.create({
      name,
      position,
      isActive: isActive === "active" ? true : false,
    });
    res.redirect("/employees/viewallemployees");
  } catch (error) {
    console.log(error);
  }
};

const viewAddEmployee = async (req, res) => {
  try {
    res.render("viewAddEmployee", { title: "Add Employee" });
  } catch (error) {
    console.log(error);
  }
};

const viewALLEmployees = async (req, res) => {
  try {
    const allemployees = await Employee.findAll();
    res.render("viewEmployees", {
      employees: allemployees,
      title: "View All Employees",
    });
  } catch (error) {
    console.log(error);
  }
};

const viewEditEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.render("editEmployee", { employee, title: "Edit Employee" });
  } catch (error) {
    console.log(error);
  }
};

const editEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { name, position, isActive } = req.body;
    console.log(req.body, "req.body  data");

    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.name = name;
    employee.position = position;
    employee.isActive = isActive === "true" ? true : false;

    await employee.save();

    res.redirect("/employees/viewallemployees");
  } catch (error) {
    console.log(error);
  }
};

export {
  addEmployee,
  viewALLEmployees,
  viewEditEmployee,
  editEmployee,
  viewAddEmployee,
};
