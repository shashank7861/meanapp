var mongoose = require('mongoose');
var Schema =mongoose.Schema;

var dbSchema = new Schema({
  dl:{type:String,require:true},
  user:{type:String,require:true,},
  createdAt:{type:Date,default:Date.now},
  author:String;
  published:{type:Boolean,default:false},
  meta{
    likes:Number
  }
});

module.exports=mongoose.model('Post',PostSchema);
