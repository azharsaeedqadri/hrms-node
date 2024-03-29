const url = require('url');
const querystring = require('querystring');
const { Allowance, AllowanceAndDeductionType } = require('../models');
const db = require('../models');
const { QueryTypes } = require('sequelize');
const {
  getResponse,
  getUserIDByBearerToken,
} = require('../utils/valueHelpers');
const { GET_ALL_ALLOWANCES } = require('../utils/constants');

async function addNewAllowance(req, res) {
  try {
    const {
      name,
      description,
      allowance_type,
      is_part_of_gross_salary,
      is_taxable,
      is_fixed,
      is_calculateable,
      percentage,
      amount,
      status,
    } = req.body;

    const isAlreadyPresent = await Allowance.findOne({
      where: { name },
    });

    if (isAlreadyPresent) {
      const resp = getResponse({}, 400, 'Allowance already exist');
      return res.send(resp);
    }

    await Allowance.create({
      name,
      description,
      allowance_type,
      is_part_of_gross_salary,
      is_taxable,
      is_fixed,
      is_calculateable,
      percentage,
      amount,
      status,
    });

    const addedAllowance = await Allowance.findOne({
      include: AllowanceAndDeductionType,
      where: {
        name,
      },
    });

    const resp = getResponse(
      addedAllowance,
      201,
      'Allowance Added Successfully.'
    );

    return res.status(201).send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, 'Something went wrong');
    return res.send(resp);
  }
}

async function getAllAllowances(req, res) {
  try {
    const allowancesList = await db.sequelize.query(GET_ALL_ALLOWANCES, {
      type: QueryTypes.SELECT,
    });

    if (!allowancesList.length) {
      const resp = getResponse([], 200, 'No Allowances Found');
      return res.status(200).send(resp);
    }

    const resp = getResponse(allowancesList, 200, 'Success');

    return res.status(200).send(resp);
  } catch (err) {
    console.error(err.sql);
    const resp = getResponse(null, 400, 'Something went wrong');
    return res.send(resp);
  }
}

async function getAllowanceByID(req, res) {
  try {
    const allowanceID = parseInt(req.params.id);
    const allowance = await Allowance.findOne({
      where: {
        allowance_id: allowanceID,
        status: true,
      },
    });

    if (!allowance) {
      const resp = getResponse(null, 404, 'No Allowance Found with this Id.');
      return res.status(200).send(resp);
    }

    const resp = getResponse(allowance, 200, 'Success');

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, 'Something went wrong');
    res.send(resp);
  }
}

async function editAllowance(req, res) {
  try {
    const allowanceID = parseInt(req.params.id);
    const bodyValues = req.body;
    const token = req.header('authorization').split('Bearer ');

    const updatedBy = getUserIDByBearerToken(token[1]);

    const values = { ...bodyValues, updatedBy };

    if (Object.keys(values).length === 0 && values.constructor === Object) {
      const resp = getResponse({}, 401, 'No values to update');
      return res.send(resp);
    }

    const allowance = await Allowance.findByPk(allowanceID, {
      where: {
        status: true,
      },
    });

    if (!allowance) {
      const resp = getResponse(null, 404, 'No Allowance Found with this Id.');
      return res.status(200).send(resp);
    }

    await Allowance.update(values, {
      where: {
        allowance_id: allowanceID,
      },
    });

    const updatedAllowance = await Allowance.findByPk(allowanceID, {
      attributes: ['allowance_id', 'name', 'description', 'status'],
    });

    const resp = getResponse(
      updatedAllowance,
      200,
      'allowance updated successfully'
    );

    return res.send(resp);
  } catch (err) {
    const resp = getResponse(err.message, 400, 'Something went wrong.');
    return res.send(resp);
  }
}

async function deleteAllowance(req, res) {
  try {
    const allowanceID = parseInt(req.params.id);

    const allowance = await Allowance.findByPk(allowanceID);

    if (!allowance) {
      const resp = getResponse(null, 404, 'No Allowance Found with this Id.');
      return res.status(200).send(resp);
    }

    const deletedRecord = await Allowance.update(
      { status: false },
      {
        where: { allowance_id: allowanceID },
      }
    );

    if (deletedRecord) {
      const resp = getResponse({ id: allowanceID }, 200, 'Success');
      return res.send(resp);
    } else {
      const resp = getResponse(null, 400, 'Error while deleting record');
      return res.send(resp);
    }
  } catch (err) {
    const resp = getResponse(null, 400, err.message);
    return res.send(resp);
  }
}

async function getPermanentAllowances(req, res) {
  try {
    const parsedUrl = url.parse(req.url);

    const queryParams = querystring.parse(parsedUrl.query);

    const type = parseInt(queryParams.type);

    // type 1 is for permanent allowances
    if (type === 1) {
      const permanentAllowances = await Allowance.findAll(
        {
          where: { is_part_of_gross_salary: true, status: true },
        },
        {
          include: AllowanceAndDeductionType,
        }
      );

      if (!permanentAllowances.length) {
        const resp = getResponse([], 200, 'No permanent allowances found.');
        return res.send(resp);
      }

      const resp = getResponse(permanentAllowances, 200, 'success');

      return res.send(resp);
    }

    // type 2 is for add-on allowances
    if (type === 2) {
      const addOnAllowances = await Allowance.findAll(
        {
          where: { is_part_of_gross_salary: false },
        },
        {
          include: AllowanceAndDeductionType,
        }
      );

      if (!addOnAllowances.length) {
        const resp = getResponse([], 200, 'No add on allowances found.');
        return res.send(resp);
      }

      const resp = getResponse(addOnAllowances, 200, 'success');

      return res.send(resp);
    }
  } catch (err) {
    const resp = getResponse(null, 400, 'Something went wrong');
    return res.send(resp);
  }
}

module.exports = {
  addNewAllowance,
  getAllAllowances,
  getAllowanceByID,
  editAllowance,
  deleteAllowance,
  getPermanentAllowances,
};
