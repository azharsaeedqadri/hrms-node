const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const fs = require("fs");
const https = require("https");

const userRouter = require("./routers/user");
const employeeRouter = require("./routers/employee");
const dropdownDataRouter = require("./routers/dropdownData");
const leavesRecordRouter = require("./routers/leavesRecord");
const rolesRouter = require("./routers/role");
const departmentRouter = require("./routers/department");
const teamRouter = require("./routers/team");
const allowanceRouter = require("./routers/allowance");
const deductionRouter = require("./routers/deduction");
const companyRouter = require("./routers/company");
const epaRouter = require("./routers/employeePayAllowance");
const epdRouter = require("./routers/employeePayDeduction");
const taxSlabsRouter = require("./routers/taxSlab");
const medicalReimbursementRouter = require("./routers/mrdicalReimbursement");
const payrollAdjustments = require("./routers/payrollAdjustments");
const designationRouter = require("./routers/designation");
const { leaveBalanceCronJob } = require("./controllers/leavesRecord");

const app = express();
var corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;

app.use(express.json());

const key = fs.readFileSync("./private.key");
const cert = fs.readFileSync("./certificate.crt");

const creds = {
  key,
  cert,
};

app.use("/api/user", userRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/dropdownData", dropdownDataRouter);
app.use("/api/leaves", leavesRecordRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/department", departmentRouter);
app.use("/api/designation", designationRouter);
app.use("/api/teams", teamRouter);
app.use("/api/allowance", allowanceRouter);
app.use("/api/deduction", deductionRouter);
app.use("/api/companies", companyRouter);
app.use("/api/epa", epaRouter);
app.use("/api/epd", epdRouter);
app.use("/api/tax", taxSlabsRouter);
app.use("/api/reimbursement", medicalReimbursementRouter);
app.use("/api/payrollAdjustments", payrollAdjustments);

// Schedule the task to reset leaves at the end of the fiscal year (fiscal year ends at July 31st at 11:59 PM)
cron.schedule("59 23 31 7 *", leaveBalanceCronJob);

app.get("/", (req, res) => {
  return res.send("Server is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const httpsServer = https.createServer(creds, app);
httpsServer.listen(8443);
