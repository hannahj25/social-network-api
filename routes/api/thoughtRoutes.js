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
router.delete('/thoughts/:thoughtId', async (req, res) => {
    Thought.findOneAndDelete(
        {_id: req.params.thoughtId}
    )
    .then(async (thought) =>{
        if(!thought){
            return res.status(404).json({message: 'No thought with that id!'})
        }
        const user = await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId} },
            { new: true }
        )

        if(!user){
            return res.status(404).json({ message: 'Thought deleted but no user with that id!'});
        }
        res.json({ message: 'Thought successfully deleted!'})
        
    })
    .catch((err) => res.status(500).json(err));
})

// Create reaction to thought
router.post('/thoughts/:thoughtId/reactions', (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: {body: req.body.body, userId: req.body.userId} }},
        { runValidators: true, new: true}
    )
    .then((thought) =>
    !thought
    ? res.status(404).json({message: 'No thought with that id!'})
    : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
})


// Delete reaction from thought
router.delete('/thoughts/:thoughtId/reactions/:reactionId', (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId},
         {$pull: { reactions:  { _id: req.params.reactionId} }},
         {new: true}
    )
    .then((thought) =>
    !thought
    ? res.status(404).json({message: 'No thought with that id!'})
    : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
})

module.exports = router