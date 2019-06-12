const sfunc = {
    getAll = id => {
        db.Headline.find({id}).then((r) => {
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
            return articles;
        })
    }
}

module.exports = sfunc;