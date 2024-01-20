const PORT = 5554
const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")
const app = express()
require("dotenv").config()


const dishes = []

const sushiDishes = [
    {
        restaurant_name: 'SUSHIHOUSE',
        address: process.env.WEBSITESUSHIHOUSE
    },
    {
        restaurant_name: 'OHMYSUSHI',
        address: process.env.WEBSITEOHMYSUSHI
    },
    // {
    //     restaurant_name: 'UMEI-SUSHI',
    //     address: process.env.WEBSITEUMSUSHI
    // },
]



sushiDishes.forEach(dish => {
    axios.get(dish.address)
        .then((res) => {
            const html = res.data
            const $ = cheerio.load(html)
            $("a", html).each(function () {
                const title = $(this).text()
                const url = $(this).attr("href")
                const price = $(this).attr("button[data-productcategorie='Maki']");
                if (price || title.includes('Maki')) {
                    dishes.push({
                        title,
                        url,
                        source: dish.restaurant_name,
                        price
                    })
                }
            })
        })
        .catch((err) => console.log(err))
})

app.listen(PORT, () => console.log(`[RUNNING ON PORT ${PORT}]`))

app.get("/", (req, res) => {
  res.json("Hi there!")
})

// test
app.get("/news", (req, res) => {
res.json(dishes)
    console.log(dishes)

})



// axios
//   .get(process.env.WEBSITE)
//   .then((response) => {
//     const html = response.data
//     const $ = cheerio.load(html)
//     console.log(html)
//     $("a", html).each(function () {
//       const title = $(this).text()
//       const url = $(this).attr("href")
//       if (title.includes(process.env.KEYWORD)) {
//         articles.push({
//           title,
//           url,
//         })
//       }
//     })
//     res.json(articles)
//     console.log(articles)
//   })
//   .catch((err) => console.log(err))

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
