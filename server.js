const express = require("express");
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var session = require("express-session");

//create schema here
mongoose.connect("mongodb://localhost/animals");
var AnimalSchema = new mongoose.Schema({
    name: String
})
var Animal = mongoose.model("Animal", AnimalSchema);
app.use(bodyParser.urlencoded({extended: true}));
//setting up ejs and views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//root route
app.get('/', function(req, res){
    Animal.find({}, function(err, animals){
        if(err){
            console.log("Something wrong with finding animals!");
        }
        res.render('index', {animals});
    })    
})
// Adding an Animal
app.post('/animal/new', function(req, res){
    var animal = new Animal({name: req.body.name});    
    animal.save(function(err){
        if(err){
            console.log("Something went wrong");
        }
        else{
            console.log("Successfully added a user!");
            res.redirect("/")
        }
    })
})
app.get('/animal/edit/:id', function (req, res) {  
    Animal.findOne({ _id: req.params.id }, function(err, animals){
        console.log(animals)
        if(err){
            console.log("Something wrong with your first edit route!");
        }
        res.render('edit', { animals:animals});
    })    
})
app.post('/animal/post/:id', function(req, res){
    Animal.update({_id: req.params.id}, {$set: {name: req.body.name}}, function(err){
        if (err) {
            console.log("Somehting wrong with deleting!");
        }
        res.redirect('/')
    })
})
app.get('/animal/destroy/:id', function(req, res){    
    console.log(req.params.id);
    Animal.remove({_id: req.params.id}, function(err){
        if(err){
            console.log("Somehting wrong with deleting!");
        }
        res.redirect('/')
    })
})
app.listen(8000, function(){
    console.log("listening on port 8000");
});