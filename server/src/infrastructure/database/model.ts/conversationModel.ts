import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    members: {
      type: Array,
    },

    lastMessage: {
      sender: {
        type: String,
      },
      text: {
        type: String,
      },
      seen : {
        type : Boolean,
        default:false
      },
      createdAt: {
        type: Date,
        default: Date.now, 
      },
    },
  },

  {
    timestamps: true,
  }
);

const conversationModel = mongoose.model("Conversation", conversationSchema);

export default conversationModel;
