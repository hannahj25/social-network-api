const Thought = require('../../models/Thought');
const User = require('../../models/User');

const router = require('express').Router();

router.get('/users', (req, res) => {
    User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json(err));
})

module.exports = router
