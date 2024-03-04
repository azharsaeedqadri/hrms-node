const { Techstack } = require('../models');
const { getResponse } = require('../utils/valueHelpers');

async function addTechstack(req, res) {
  try {
    const { name, description } = req.body;
    if (name.trim() === '') {
      const resp = getResponse(
        null,
        401,
        'Please provide name of the Tech Stack'
      );
      return res.send(resp);
    }

    const alreadyPresent = await Techstack.findOne({
      where: { name },
    });

    if (alreadyPresent) {
      await Techstack.update({ is_deleted: false }, { where: { name } });

      const updatedRecord = Techstack.findOne({ where: { name } });

      const resp = getResponse(updatedRecord, 400, 'Record Already Exists');
      return res.send(resp);
    }

    await Techstack.create({
      name,
      description,
    });

    const addedTechstack = await Techstack.findOne({ where: { name } });

    const resp = getResponse(addedTechstack, 200, 'Record added successfully');

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function editTechstack(req, res) {
  try {
    const values = req.body;
    const techstackID = parseInt(req.params.id);

    await Techstack.update(values, { where: { id: techstackID } });

    const updatedRecord = await Techstack.findByPk(techstackID);

    const resp = getResponse(
      updatedRecord,
      200,
      `Record updated successfully for ID: ${techstackID}`
    );

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
    console.error(err);
  }
}

async function deleteTechstack(req, res) {
  try {
    const techstackID = parseInt(req.params.id);

    await Techstack.destroy({ where: { id: techstackID } });

    const resp = getResponse(techstackID, 200, 'Record deleted successfully.');

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
    console.error(err);
  }
}

async function getTechstacks(req, res) {
  try {
    const techstacks = await Techstack.findAll({
      where: { is_deleted: false },
    });

    if (!techstacks.length) {
      const resp = getResponse(null, 404, 'No records found');
      return res.send(resp);
    }

    const resp = getResponse(
      techstacks,
      200,
      'Tech Stacks fetched successfully.'
    );

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.error(err);
    res.send(resp);
  }
}

async function getTechstackByID(req, res) {
  try {
    const techstackID = parseInt(req.params.id);

    const techstack = await techstack.findByPk(techstackID, {
      where: { is_deleted: false },
    });

    if (!techstack) {
      const resp = getResponse(null, 404, 'No records found');
      return res.send(resp);
    }

    const resp = getResponse(
      techstack,
      200,
      'Tech Stack fetched successfully.'
    );

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    console.error(err);
    res.send(resp);
  }
}

module.exports = {
  addTechstack,
  editTechstack,
  getTechstacks,
  getTechstackByID,
  deleteTechstack,
};
