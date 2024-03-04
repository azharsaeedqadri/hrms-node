const express = require('express');
const {
  addTechstack,
  getTechstacks,
  editTechstack,
  getTechstackByID,
  deleteTechstack,
} = require('../controllers/techstack');

const router = express.Router();

router.post('/add', addTechstack);

router.get('/getAll', getTechstacks);

router.put('/:id', editTechstack);

router.get('/:id', getTechstackByID);

router.delete('/:id', deleteTechstack);

module.exports = router;
