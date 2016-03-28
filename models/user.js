var mongoose = require('mongoose');

var Task = require('./task');

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  tasklist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

mongoose.model('User', UserSchema);