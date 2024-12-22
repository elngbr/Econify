const express = require('express');
const router = express.Router();
const {
    getDeliverablesByTeam,
    getDeliverablesByProject,
    getDeliverablesForUser,
    getDeliverablesDueSoon,
} = require('../controllers/deliverableController');

// Deliverable routes
router.get('/deliverables/team/:teamId', getDeliverablesByTeam);
router.get('/deliverables/project/:projectId', getDeliverablesByProject);
router.get('/deliverables/user/:userId', getDeliverablesForUser);
router.get('/deliverables/due-soon', getDeliverablesDueSoon);

module.exports = router;
