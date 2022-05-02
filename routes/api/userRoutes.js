const Thought = require('../../models/Thought');
const User = require('../../models/User');

const router = require('express').Router();

router.get('/users', (req, res) => {
    User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json(err));
});

router.get('/users/:userId', (req, res) => {
    User.findOne({_id: req.params.userId})
    .select('-__v')
    .then((user) =>
    !user
    ? res.status(404).json({ message: 'No user with that ID!'})
    : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
});

module.exports = router
