var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  title: {type: String},
  category: {type: String, default: "N/A"},
  dueDate: String,
  description: {type: String, default: "No Description"},
  timeSpent: {type: Number, default: 0},
  priority: {type: String, default: "Low"},
  complete: {type: Boolean, default: false},

});

TaskSchema.methods.completed = function (cb) {
  this.complete = true;
  this.save(cb);
};

TaskSchema.methods.uncompleted = function (cb) {
  this.complete = false;
  this.save(cb);
};

TaskSchema.methods.setPriority = function (newPriority, cb) {
  this.priority = newPriority;
  this.save(cb);
};

TaskSchema.methods.addTime = function (time, cb) {
  this.timeSpent += time;
  this.save(cb);
};
mongoose.model('Task', TaskSchema);