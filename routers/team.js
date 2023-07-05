const express = require("express");
const {
  addTeam,
  getTeams,
  editTeam,
  getTeamByID,
} = require("../controllers/team");

const router = express.Router();

router.post("/add", addTeam);

router.get("/getAll", getTeams);

router.put("/:id", editTeam);

router.get("/:id", getTeamByID);

module.exports = router;
