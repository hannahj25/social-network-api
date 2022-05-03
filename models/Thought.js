const { Schema, model } = require("mongoose");
const User = require("./User");

// Schema defines Reaction subdocument
const reactionSchema = new Schema(
    {
      body: {
        type: String,
        required: true,
        maxlength: 280,
      },
      userId: {
          type: Schema.Types.ObjectId,
          ref: User
      }
     
    },
    {
      timestamps: true,
    }
    
  );

// Schema defines Thought document
const thoughtSchema = new Schema(
  {
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
        
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: User
  },
    reactions: [
      reactionSchema
    ],

  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
    timestamps: true
  }
);

// Virtual to display how many reactions a post has
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

// Initialise Thought model
const Thought = model('thought', thoughtSchema);

module.exports = Thought;