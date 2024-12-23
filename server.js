const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

// middleware and view engine 
app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema({
    name: String,
    age:Number,
    gender:String,
    mobile:String
});

const person = mongoose.model('person', userSchema);

mongoose.connection.on('connected', ()=>{
    console.log("mongodb connected....");
});
mongoose.connection.on('error', (err)=>{
    console.log(`error occurred `, err);
})

app.get('/', async(req,res)=>{
    res.redirect('/person');
});

// get person list
app.get('/person', async (req, res) => {
    const people = await person.find();
    res.render('personTable', { people });
});


// create a form to create a person
app.get('/person/create', (req,res)=>{
    res.render('personForm', {p:{}, action:'/person/create'});
});

app.post('/person/create', async (req, res) => {
    const { name, age, gender, mobile } = req.body;
    await person.create({ name, age, gender, mobile });
    res.redirect('/person');
});

// display form to update and post it 
app.get('/person/edit/:id', async(req,res)=>{
    const p = await person.findById(req.params.id);
    res.render('personForm', {p, action:`/person/edit/${req.params.id}`});
})
app.post('/person/edit/:id', async (req, res) => {
    const { name, age, gender, mobile } = req.body;
    await person.findByIdAndUpdate(req.params.id, { name, age, gender, mobile });
    res.redirect('/person');
});

// delete the existing row 
app.get('/person/delete/:id', async(req,res)=>{
    const p = await person.findById(req.params.id);
    res.render('deleteConformation',{p});
})
app.post('/person/delete/:id', async(req,res)=>{
    await person.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

// startign the server 
app.listen(3000);

module.exports = mongoose;
