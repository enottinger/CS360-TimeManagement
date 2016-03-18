var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  title: String,
  category: String,
  dueDate: Date,
  description: String,
  timeSpent: {type: Number, default: 0},
  priority: String,
  complete: {type: Boolean, default: false}

});
mongoose.model('Task', TaskSchema);