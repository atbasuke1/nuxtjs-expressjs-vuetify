const mongoose = require('mongoose');
const Schema = mongoose.Schema;
  
const imageSchema = new Schema({
    name: String,
    id : {
        ref:'files',
        type: Schema.Types.ObjectId
    },
    url: String,
});
module.exports = new mongoose.model('files', imageSchema);