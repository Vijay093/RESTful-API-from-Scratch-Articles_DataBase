//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true});

const article_schema ={
    title: String,
    content: String
}

const Article = mongoose.model("Article", article_schema)

app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// GET all the articles from server
app.get("/articles", function(req, res){
    Article.find().then( (data) => {
        res.send(data);
    }).catch( (err) => {
        res.send(err);
    })
});

app.post("/articles", function(req,res){

    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });

    article.save().then( (data) => {
        res.send(data);
    }).catch( (err) =>{
        console.log(err);
    });
});

app.delete("/articles", function (req,res){

    Article.deleteMany().then( (data) => {
        res.send(data);
    }).catch( (err) => {
        res.send(err);
    });
});


app.route("/articles/:articleTitle")

.get( function(req,res){
    Article.findOne({"title":req.params.articleTitle})
    .then((data) =>{
        res.send(data);
    })
    .catch((err) =>{
        res.send(err);
    });
})
.put( function(req,res){
    Article.findOneAndUpdate({"title":req.params.articleTitle},{"title":req.body.title, "content":req.body.content},{overwrite:true})
    .then((data) =>{
        res.send("Succesfully updated put request");
    })
    .catch((err) =>{
        res.send(err);
    });
})
.patch( function(req,res){
    Article.findOneAndUpdate({"title":req.params.articleTitle},{$set: req.body})
    .then((data) =>{
        res.send("Updated the document succesfully. Only the specified documents in patch body requests are updated.");
    })
    .catch((err) =>{
        res.send(err);
    });
})
.delete( function(req,res){
    Article.deleteOne({"title":req.params.articleTitle})
    .then((data) =>{
        res.send("Succesfully deleted the specific document");
    })
    .catch((err) =>{
        res.send(err);
    });
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});