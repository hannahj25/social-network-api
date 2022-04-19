const { Schema, model } = require("mongoose");
const User = require("./User");

const reactionSchema = new Schema(
    {
      body: {
        type: String,
        required: true,
        maxlength: 280,
      },
      user_id: {
          type: Schema.Types.ObjectId,
          ref: User
      }
     
    },
    {
      timestamps: true,
    }
    
  );


const thoughtSchema = new Schema(
  {
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
        
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

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;