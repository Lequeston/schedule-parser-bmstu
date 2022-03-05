const { Schema, model } = require('mongoose');

const GroupSchema = new Schema({
  title: {type: String, unique: true, required: true}
});

module.exports = model('Group', GroupSchema);