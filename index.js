const PORT = 5554
const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")
const app = express()
require("dotenv").config()


const dishes = []

const sushiDishes = [
    {
        restaurant_name: process.env.RESTAURANTTWO,
        address: process.env.WEBSITETWO
    },
    {
        restaurant_name: process.env.RESTAURANTTHREE,
        address: process.env.WEBSITETHREE
    },
    {
        restaurant_name: process.env.RESTAURANTONE,
        address: process.env.WEBSITEONE
    },
]



// const processedTitles = new Set();

sushiDishes.forEach(dish => {
    axios.get(dish.address)
        .then((res) => {
            const html = res.data;
            const $ = cheerio.load(html);


            // fix code
            const price = $("span.c-product__price__amount").attr('content');
            const title = $("h4.c-product__title").text();

            if (price && title) {
                dishes.push({
                    title,
                    name: dish.restaurant_name,
                    source: dish.address,
                    price
                });
            }
            //fix code

            $("button[data-productnaam][data-prijs]", html).each(function () {
                const title = $(this).attr('data-productnaam');
                const price = $(this).attr('data-prijs');
                if (price && (/\bzalm\b/i.test(title) || /\bsalmon\b/i.test(title)) && !title.includes('Mix')) {
                    const existingDishIndex = dishes.findIndex(item => item.title === title);
                    if (existingDishIndex !== -1) {
                        dishes.splice(existingDishIndex, 1);
                    }
                    dishes.push({
                        title,
                        name: dish.restaurant_name,
                        source: dish.address,
                        price
                    });
                }
            });
        })
        .catch((err) => console.log(err));
});



app.listen(PORT, () => console.log(`[RUNNING ON PORT ${PORT}]`))

app.get("/", (req, res) => {
  res.json("Hi there!")
})

// test
app.get("/news", (req, res) => {
res.json(dishes)
    console.log(dishes)

})


