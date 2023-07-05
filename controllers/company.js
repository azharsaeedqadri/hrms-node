const { Company } = require("../models");
// const db = require("../models");
// const { QueryTypes } = require("sequelize");
const { getResponse } = require("../utils/valueHelpers");
// const { GET_TEAMS_QUERY } = require("../utils/constants");

async function addCompany(req, res) {
  try {
    const { company_name, company_email, company_address } = req.body;

    if (company_name.trim() === "") {
      const resp = getResponse(
        null,
        401,
        "Please provide the name of the company."
      );
      return res.send(resp);
    }

    const alreadyPresent = await Company.findOne({ where: { company_name } });

    if (alreadyPresent) {
      const resp = getResponse(null, 200, "Company already present");
      return res.send(resp);
    }

    await Company.create({
      company_name,
      company_email,
      company_address,
    });

    const addedCompany = await Company.findOne({ where: { company_name } });

    const resp = getResponse(addedCompany, 200, "Record added successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.log(err);
    res.send(resp);
  }
}

async function editCompany(req, res) {
  try {
    const values = req.body;
    const companyID = parseInt(req.params.id);

    await Company.update(values, { where: { company_id: companyID } });

    const updatedRecord = await Company.findByPk(companyID);

    const resp = getResponse(
      updatedRecord,
      200,
      "Record updated successfully."
    );

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.log(err);
    res.send(resp);
  }
}

async function getCompanies(req, res) {
  try {
    const companies = await Company.findAll();

    if (!companies.length) {
      const resp = getResponse(null, 404, "No records found");
      return res.send(resp);
    }

    const resp = getResponse(companies, 200, "Companies fetched successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.log(err);
    res.send(resp);
  }
}

async function getCompanyByID(req, res) {
  try {
    const companyID = parseInt(req.params.id);

    const company = await Company.findByPk(companyID);

    if (!company) {
      const resp = getResponse(null, 404, "No records found");
      return res.send(resp);
    }

    const resp = getResponse(company, 200, "Company fetched successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.log(err);
    res.send(resp);
  }
}

async function deleteCompany(req, res) {
  try {
    const companyID = parseInt(req.params.id);

    const deletedCompany = await Company.destroy({
      where: { company_id: companyID },
    });

    const resp = getResponse(
      deletedCompany,
      200,
      "Record deleted successfully"
    );

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.log(err);
    res.send(resp);
  }
}

module.exports = {
  addCompany,
  editCompany,
  getCompanies,
  getCompanyByID,
  deleteCompany,
};
