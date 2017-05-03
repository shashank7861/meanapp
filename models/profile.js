var mongoose = require('mongoose');
var Schema =mongoose.Schema;

var ProfileSchema = new Schema({
  id:{type:String,require:true},
  address:{type:String,require:true},
  city:{type:String,require:true},
  state:{type:String,require:true},
  country:{type:String,default:'u'},
  pin:{type:Number,require:true}
});

module.exports=mongoose.model('Profile',ProfileSchema);
