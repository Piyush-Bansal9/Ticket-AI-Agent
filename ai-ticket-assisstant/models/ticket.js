import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    Status: {type: String, default: "To-do"},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref : "User"},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref : "User", default: null},
    priority: String,
    deadline: Date,
    helpfulNotes: String,
    relatedSkills: [String],
    createdAt : {type: Date, default: Date.now},
})

export default ticketModel = mongoose.model("Ticket", ticketSchema)