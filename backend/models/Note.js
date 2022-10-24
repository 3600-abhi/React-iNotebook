const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {

        // yeh line ki help se sirf user apna wala hi notes dekh paayega
        // same as foreign key in SQL 
        type: mongoose.Schema.Types.ObjectId,
        
        ref: "user"
    },

    title : {
        type: String,
        required: true
    },

    description : {
        type: String,
    },

    tag : {
        type: String,
        default : "General"
    },

    date : {
        type: Date,
        default: Date.now 
    },


});

const Note = mongoose.model('notes', NotesSchema);
module.exports = Note;
