const express = require('express');
const { createComplaint, getComplaints, resolveComplaint, getComplaintById, getUserComplaints } = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

const upload = require('../config/multer');

router.route('/my-complaints').get(protect, getUserComplaints);

router.route('/')
    .post(upload.array('media', 3), createComplaint) // Allow up to 3 files
    .get(protect, admin, getComplaints);

router.route('/:id/resolve')
    .put(protect, admin, resolveComplaint);

router.route('/:id').get(getComplaintById);

module.exports = router;
