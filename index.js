const PORT = 8000
const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")
const app = express()
require("dotenv").config()

app.listen(PORT, () => console.log(`[RUNNING ON PORT ${PORT}]`))

app.get("/", (req, res) => {
  res.json("Hi there!")
})

app.get("/news", (req, res) => {
  const articles = []
  axios
    .get(process.env.WEBSITE)
    .then((response) => {
      const html = response.data
      const $ = cheerio.load(html)
      console.log(html)
      $("a", html).each(function () {
        const title = $(this).text()
        const url = $(this).attr("href")
        if (title.includes(process.env.KEYWORD)) {
          articles.push({
            title,
            url,
          })
        }
      })
      res.json(articles)
      console.log(articles)
    })
    .catch((err) => console.log(err))
})

/* $('a.most-read-post__title', html).each(function() {
        const title = $(this).text()
        const url = $(this).attr('href')
        if (title.toLowerCase().includes('amsterdam')) {
          articles.push({
            title,
            url
          })
        }
      })
      res.json(articles)
      console.log(articles)
    }).catch((err) => console.log(err))
}) */
