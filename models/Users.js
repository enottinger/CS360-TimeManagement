var mongoose = require('mongoose');

var Task = require('./Tasks');

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  tasklist: [Task]
});
mongoose.model('User', UserSchema);