var Post=require('../../models/posts');

var createPost=function(req,res){
  var post={
    title:req.body.title,
    data:req.body.data,
    
  };
  var post=new Post(post);
  data.save();
  console.log("saveddd");
  //res.render(post{post});
}

var getPost=function(req,res){
  Post.find()
  .then(function(doc){
  res.render('system/users',{title: 'Posts',user:doc ,layout: 'dash.hbs'});
}
module.export={
  createPost,
  getPost
}
