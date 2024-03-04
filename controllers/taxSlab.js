const { TaxSlab } = require("../models");
const { getResponse } = require("../utils/valueHelpers");

async function addTaxSlab(req, res) {
  try {
    const {
      tax_slab_name,
      tax_slab_description,
      minimum_income,
      maximum_income,
      percentage,
      additional_amount,
    } = req.body;

    if (
      tax_slab_name.trim() === "" ||
      minimum_income === "" ||
      minimum_income === null ||
      minimum_income === undefined ||
      !maximum_income ||
      percentage === "" ||
      percentage === null ||
      percentage === undefined
    ) {
      const resp = getResponse(
        null,
        400,
        "Kindly provide complete details for the tax slab."
      );
      return res.send(resp);
    }

    const isAlreadyExist = await TaxSlab.findOne({ where: { tax_slab_name } });

    if (isAlreadyExist) {
      const resp = getResponse(null, 400, "Tax slab aready exists");
      return res.send(resp);
    }

    const createdTaxSlab = await TaxSlab.create({
      tax_slab_name,
      tax_slab_description,
      minimum_income,
      maximum_income,
      percentage,
      additional_amount,
    });

    const resp = getResponse(createdTaxSlab, 200, "success");
    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong.");
    console.error(err);
    res.send(resp);
  }
}

async function editTaxSlab(req, res) {
  try {
    const tax_slab_id = parseInt(req.params.id);

    const {
      tax_slab_name,
      tax_slab_description,
      minimum_income,
      maximum_income,
      percentage,
      additional_amount,
    } = req.body;

    const isTaxSlabExist = await TaxSlab.findByPk(tax_slab_id);

    if (!isTaxSlabExist) {
      const resp = getResponse(null, 404, "This tax slab does not exist");
      return res.send(resp);
    }

    await TaxSlab.update(
      {
        tax_slab_name,
        tax_slab_description,
        minimum_income,
        maximum_income,
        percentage,
        additional_amount,
      },
      { where: { tax_slab_id } }
    );

    const updatedTaxSlab = await TaxSlab.findByPk(tax_slab_id);

    const resp = getResponse(updatedTaxSlab, 200, "success");
    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong.");
    console.error(err);
    res.send(resp);
  }
}

async function deleteTaxSlab(req, res) {
  try {
    const tax_slab_id = parseInt(req.params.id);

    await TaxSlab.destroy({ where: { tax_slab_id } });

    const resp = getResponse(null, 200, "success deleting tax slab");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong.");
    console.error(err);
    res.send(resp);
  }
}

async function getTaxSlabByID(req, res) {
  try {
    const tax_slab_id = parseInt(req.params.id);

    const taxSlab = await TaxSlab.findByPk(tax_slab_id);

    if (!taxSlab) {
      const resp = getResponse(null, 404, "Tax Slab not found");
      return res.send(resp);
    }

    const resp = getResponse(taxSlab, 200, "success");
    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong.");
    console.error(err);
    res.send(resp);
  }
}

async function getAllTaxSlabs(req, res) {
  try {
    const taxSlabs = await TaxSlab.findAll();

    if (!taxSlabs.length) {
      const resp = getResponse(null, 404, "No tax slabs found");
      return res.send(resp);
    }

    const resp = getResponse(taxSlabs, 200, "success");
    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, "Something went wrong.");
    console.error(err);
    res.send(resp);
  }
}

module.exports = {
  addTaxSlab,
  editTaxSlab,
  deleteTaxSlab,
  getTaxSlabByID,
  getAllTaxSlabs,
};
