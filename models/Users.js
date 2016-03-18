var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  tasklist: [Task]
});
mongoose.model('User', UserSchema);