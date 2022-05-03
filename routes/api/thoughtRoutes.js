const Thought = require("../../models/Thought");
const User = require("../../models/User");

const router = require('express').Router();

// Get all thoughts
router.get('/thoughts', (req, res) => {
    Thought.find()
    .then((thoughts) => res.json(thoughts))
    .catch((err) => res.status(500).json(err));
});

// Get single thought by id
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

// Create new thought
router.post('/thoughts', (req, res) => {
    Thought.create(req.body)
    .then((thought) => {
        return User.findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: req.params.thoughtId}},
            { runValidators: true, new: true }
        );
    })
    .then((user) =>
    !user? res.status(404).json({ message: 'Thought created, but found no user with that id!'})
    : res.json('Created the thought!')
    )
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    })
})

// Update existing thought
router.put('/thoughts/:thoughtId', (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId},
        { $set: req.body },
        { runValidators: true, new: true}
    )
    .then((thought) =>
    !thought? res.status(404).json({message: 'No thought with that id!'})
    : res.json(thought)
    )
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
})

// Delete thought
router.delete('/thoughts/:thoughtId', (req, res) => {
    Thought.findOneAndDelete(
        {_id: req.params.thoughtId}
    )
    .then((thought) =>
    !thought? res.status(404).json({message: 'No thought with that id!'})
    : User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId} },
        { new: true }
       )
    )
    .then((user) =>
    !user
    ? res.status(404).json({ message: 'Thought deleted but no user with that id!'})
    : res.json({ message: 'Thought successfully deleted!'})
    )
    .catch((err) => res.status(500).json(err));
})

// Create reaction to thought

// Delte reaction from thought

module.exports = router