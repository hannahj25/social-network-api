const Thought = require("../../models/Thought");
const User = require("../../models/User");

const router = require('express').Router();

// Get all thoughts
router.get('/thoughts', (req, res) => {
    Thought.find()
    .then((thoughts) => res.json(thoughts))
    .catch((err) => res.status(500).json(err));
});

router.get('/thoughts/:thoughtId', (req, res) => {
    Thought.findOne({_id: req.params.thoughtId})
    .select('-__v')
    .then((thought) =>
    !thought
    ? res.status(404).json({ message: 'No thought with that Id!'})
    : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
});