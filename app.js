//import frameworks
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

//set app to "express"
const app = express();

//set up engine
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//mongoose connection
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("ArticleSchema", articleSchema);

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    let x = req.body;
    console.log(x.title);
    console.log(x.content);

    const jack = new Article({
      title: x.title,
      content: x.content,
    });
    jack.save(function (err) {
      if (err) {
        console.log(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(
      //omit conditions to delete all
      function (err) {
        if (!err) {
          res.send("Deleted all articles");
        } else {
          console.log(err);
        }
      }
    );
  });

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("no articles matching title");
        }
      }
    );
  })

  .put(function (req, res) {
    Article.findOneAndUpdate(
      //update() is depracated and updateOne() does not allow overwrites
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Updated article");
        } else {
          console.log(err);
          res.send("Failed to update.");
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Updated article");
        } else {
          console.log(err);
          res.send("Failed to update.");
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Article deleted");
      } else {
        console.log(err);
        res.send("Failed to delete");
      }
    });
  });

//establish PORT process.env.PORT ||
const PORT = 8000;

app.listen(PORT, function () {
  console.log("Server started on port " + PORT);
});
