var mongoose = require('mongoose');
var Schema =mongoose.Schema;

var ProfileSchema = new Schema({
  id:{type:String,require:true},
  address:{type:String,require:true},
  city:{type:String,require:true},
  state:{type:String,require:true},
  country:{type:String,require:true},
  pin:{type:Number,require:true},
  user:{type:String,require:true},
  createdAt:{type:Date,default:Date.now},
});

module.exports=mongoose.model('Profile',ProfileSchema);
