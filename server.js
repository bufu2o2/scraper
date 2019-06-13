const express = require('express');
const ax = require('axios');
const cheerio = require('cheerio');
const logger = require('morgan');
const mongoose = require('mongoose');
const exhb = require('express-handlebars');
const path = require('path');


const PORT = process.env.PORT || 8008;
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/scraperdb';

let db = require(path.join(__dirname, "./models"));

const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.engine('handlebars', exhb({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');

mongoose.connect(MONGODB_URI);

app.get('/scrape', (req,res) => {
    console.log('scrape started');
    let artArr = [];
    ax.get('https://bestlifeonline.com/funniest-newspaper-headlines-of-all-time/').then((r) => {
    const $ = cheerio.load(r.data);
    $('.title').each((i, e) => {
        let x = $(e).text();
        let rx = new RegExp('^\“.*\”$');
        if(rx.test(x)){
            artArr.push(x);
        }
    });
})
.then((r) => console.log(artArr))
.then((r) => res.render('index', {articles: artArr}));

});

app.post('/api/headline', (req,res) => {
    let b = req.body;
    console.log(b);
    db.Headline.create(b);
})

app.get('/comment/:id', (req,res) => {
    let articles = [];
    let id = req.params.id;
console.log(`this is the id from comment ${id}`);
if(id === 'app.js'){
    console.log('bad route avoided');
    res.redirect('/app.js');
}
else{
    let t = 'OG';
    let cId = [];
    let c = [];
 db.Headline.find({_id:id}).then( r => {
    t = r[0].title;
    cId = r[0].comments;
    console.log(`this is the comments ID ${cId} &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& ${r[0]}`);
    console.log(`this is r inside comment id ${t} and ${id}`);
}).then(() => {
    db.Headline.find({}).then((r) => {
        console.log(r);
        for(let i = 0;i<r.length;i++){
            articles.push(
                {
                    title: r[i].title,
                    saved: true,
                    id: r[i].id
                });
        }
    }).then(() => {
        for(let i = 0; i<cId.length; i++){
            db.Comment.find({_id:cId[i]}).then( r => {
                console.log(`this is r inside of the comment return: ${r[0].body}`)
                c.push(r[0].body);
            })
        }
    }).then(() => {
        setTimeout(() => {
            console.log('its render time - modal style')
            res.render('modal', { articles, cTitle: t, commentId: id, comment: c })
        }, 500);
    })
})

    }
})

app.delete('/delete', (req,res) => {
    let dataId = req.body.id;
    console.log(dataId);
    db.Headline.findOneAndRemove({ _id: dataId }, e => {
        if (e){
            console.log(e);
            return res.status(500).send();
        }

        return res.status(200).send();
    });
    console.log(`${dataId} has been removed`);
})

app.get('/', (req,res) => {
    db.Headline.find({}).then((r) => {
        let articles = [];
        console.log(r);
        for(let i = 0;i<r.length;i++){
            articles.push(
                {
                    title: r[i].title,
                    saved: true,
                    id: r[i].id
                });
        }
        res.render('index', { articles });
    })
})

app.get('/deleteAll', (req,res) => {
    db.Headline.remove({}, e => {
        if(e){
            console.log(e);
            return res.status(500).send();
        }
        db.Comment.remove({}, e => {
            if(e){
                console.log(e);
                return res.status(500).send();
            }
        })
        console.log('collection removed')
        res.redirect('/');
    })
})

app.post('/submit', (req,res) => {
    let b = req.body.body;
    let id = req.body.id;
    console.log(`this is the req.body of comment: ${b} and the req id: ${id}`);
    db.Comment.create({body:b})
    .then( r => db.Headline.findOneAndUpdate({_id:id}, { $push: { comments: r._id }}, { new: true }))
    .then( () => {
            console.log('about to redirect')
            res.redirect('/comment/'+id);  
    })
})

app.listen(PORT, () => console.log(`Scraper is running on http://localhost:${PORT}`));