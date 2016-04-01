var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
  title: {type: String},
  category: {type: String, default: "N/A"},
  dueDate: String,
  description: {type: String, default: "No Description"},
  timeSpent: {type: Number, default: 0},
  priority: {type: String, default: "Low"},
  complete: {type: Boolean, default: false},
  active: {type: Boolean, default: false},
  startDate: {type: Date, default: null},

});

TaskSchema.methods.completed = function (cb) {
  this.complete = true;
    if(active){
    this.active = false;
    var current = Date.now();
    if(this.startDate == null)
       console.log("ERROR, setInactive called before active");
    var seconds = (current - this.startDate)/1000;
    this.timeSpent += seconds;
    this.startDate = null;
  }
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

TaskSchema.methods.setActive = function(){
  this.active = true;
  this.startDate = new Date();
};

TaskSchema.methods.setInactive = function(){
  this.active = false;
  var current = Date.now();
  if(this.startDate == null)
     console.log("ERROR, setInactive called before active");
  var seconds = (current - this.startDate)/1000;
  this.timeSpent += seconds;
  this.startDate = null;
};

mongoose.model('Task', TaskSchema);