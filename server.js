const express = require('express');
const ax = require('axios');
const cheerio = require('cheerio');
const logger = require('morgan');
const mongoose = require('mongoose');
const exhb = require('express-handlebars');


const PORT = 8008;

let db = require("./models");

const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.engine('handlebars', exhb({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');

mongoose.connect('mongodb://localhost/scraperdb', { useNewUrlParser: true });

// app.get('/', (req,res) => {
//     // db.Headline.remove({}, e => console.log('collection removed'));
//     db.Headline.find({}).then((r) => {
//         console.log(r);
//         let articles = [];
//         for(let i=0;i<r.length;i++){
//             articles.push(r[i].title);
//         }
//         // res.render('index', { articles: ['asdf', 'asdf', 'asdf'] });
//         res.render('index', { articles , saved: false});
//     });
// });

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
            // db.Headline.create({ title: x })
            // .then((dbH) => console.log(dbH))
            // .catch((e) => console.log(e.message));
        }
    });
})
.then((r) => console.log(artArr))
.then((r) => res.render('index', {articles: artArr}));
// .then((r) => window.location.replace('/'));

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
 db.Headline.find({_id:id}).then( r => {
     let t = r[0].title;
     let cId = r[0].comments;
     let c = [];
     console.log(`this is the comments ID ${cId}`);
        console.log(`this is r inside comment id ${t} and ${id}`);

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
        });
        
        for(let i = 0; i<cId.length; i++){
            db.Comment.find({_id:cId[i]}).then( r => {
                console.log(`this is r inside of the comment return: ${r[0].body}`)
                c.push({ body: r[0].body });
            })
        }
       

        res.render('modal', { articles, cTitle: t, commentId: id, comment: c });
    });
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
        // return res.status(200).send();
    })
})

app.post('/submit', (req,res) => {
    let b = req.body.body;
    let id = req.body.id;
    console.log(`this is the req.body of comment: ${b} and the req id: ${id}`);
    db.Comment.create({body:b})
    .then( r => db.Headline.findOneAndUpdate({_id:id}, { $push: { comments: r._id }}, { new: true }))
    .then( () => res.redirect('/'));
})

app.listen(PORT, () => console.log(`Scraper is running on http://localhost:${PORT}`));



























// const mongoose = require("mongoose");
// const logger = require("morgan");
// const express = require('express');
// const app = express();

// const PORT = 8008;
// const db = require("./models");

// app.use(logger("dev"));
// app.use(express.urlencoded({ extended: true }));

// app.use(express.static(__dirname + '/public'));

// const exhb = require("express-handlebars");
// app.engine("handlebars", exhb({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

// mongoose.connect('mongodb://localhost/scraped', { useNewUrlParser: true });



// app.get('/', (req,res) => {
//     res.send("Hello World!")
// });


// app.listen(PORT, () => console.log(`Scraper is now running on http://localhost:${PORT} !`));