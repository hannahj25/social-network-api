const Thought = require('../../models/Thought');
const User = require('../../models/User');

const router = require('express').Router();

// Get all users
router.get('/users', (req, res) => {
    User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json(err));
});

// Get a single user by id
router.get('/users/:userId', (req, res) => {
    User.findOne({_id: req.params.userId})
    .select('-__v')
    .then((user) =>
    !user
    ? res.status(404).json({ message: 'No user with that Id!'})
    : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
});

// Create a new user
router.post('/users', (req, res) => {
    User.create(req.body)
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
});

// Update existing user
router.put('/users/:userId', (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
    .then((user) =>
    !user
    ? res.status(404).json({ message: 'No user with that id!'})
    : res.json(user)
    )
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Delete user
router.delete('/users/:userId', (req, res) => {
    User.findOneAndDelete({ _id: req.params.userId})
    .then((user) =>
    !user
    ? res.status(404).json({ message: "No user with that id!"})
    : Thought.deleteMany({ _id: { $in: user.thoughts }})
    )
    .then(() => res.json({ message: "User and associated thoughts deleted!"}))
    .catch((err) => res.status(500).json(err))
});

module.exports = router
