const { Team } = require("../models");
const db = require("../models");
const { QueryTypes } = require("sequelize");
const { getResponse } = require("../utils/valueHelpers");
const { GET_TEAMS_QUERY } = require("../utils/constants");

async function addTeam(req, res) {
  try {
    const { name, description, department_id } = req.body;

    if (name.trim() === "") {
      const resp = getResponse(
        null,
        401,
        "Please provide the name of the team."
      );
      return res.send(resp);
    }

    const alreadyPresent = await Team.findOne({ where: { name } });

    if (alreadyPresent) {
      await Team.update({ is_deleted: false }, { where: { name } });

      const updatedTeam = await Team.findOne({ where: { name } });

      const resp = getResponse(updatedTeam, 200, "Record added successfully");
      return res.send(resp);
    }

    await Team.create({
      name,
      description,
      department_id,
    });

    const addedTeam = await Team.findOne({ where: { name } });

    const resp = getResponse(addedTeam, 200, "Record added successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function editTeam(req, res) {
  try {
    const values = req.body;
    const teamID = parseInt(req.params.id);

    await Team.update(values, { where: { id: teamID } });

    const updatedRecord = await Team.findByPk(teamID);

    const resp = getResponse(
      updatedRecord,
      200,
      "Record updated successfully."
    );

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function getTeams(req, res) {
  try {
    const teams = await db.sequelize.query(GET_TEAMS_QUERY, {
      type: QueryTypes.SELECT,
    });

    if (!teams.length) {
      const resp = getResponse(null, 404, "No records found");
      return res.send(resp);
    }

    const resp = getResponse(teams, 200, "Teams fetched successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function getTeamByID(req, res) {
  try {
    const teamID = parseInt(req.params.id);

    const team = await Team.findByPk(teamID, {
      where: { is_deleted: false },
    });

    if (!team) {
      const resp = getResponse(null, 404, "No records found");
      return res.send(resp);
    }

    const resp = getResponse(team, 200, "Roles fetched successfully");

    res.send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

module.exports = {
  addTeam,
  editTeam,
  getTeams,
  getTeamByID,
};
