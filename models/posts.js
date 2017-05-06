var mongoose = require('mongoose');
var Schema =mongoose.Schema;

var PostSchema = new Schema({
  title:{type:String,require:true},
  body:{type:String,require:true,},
  createdAt:{type:Date,default:Date.now},
  author:String;
  read:{type:Boolean,default:false},
  meta{
    likes:Number
  }
