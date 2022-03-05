const { Schema, model } = require('mongoose');

const ClassroomSchema = new Schema({
  number: {type: String, unique: true, required: true}
});

module.exports = model('Classroom', ClassroomSchema);