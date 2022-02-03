const express = require('express');
const body = require('body-parser');
app = express();
const path = require('path');
const fetch = require('node-fetch');
const { response } = require('express');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(body.urlencoded({ extended: false }))

const key = 'b05a100c6e6c27146f81ad75c338bae4';
let city = 'Tartu';

const getWeatherDataPromise = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(response => {
            return response.json();
        })
        .then((data) => {
            let description = data.weather[0].description;
            let city = data.name;
            let temp = Math.round(parseFloat(data.main.temp) - 273.15);
            let result = {
                description: description,
                city: city,
                temp: temp
            }
            resolve(result);
        })
        .catch(error => {
            reject(error);
        })
    })
}

app.all('/', (req, res) => {
    let city;
    if(req.method == 'GET') {
        city = 'Tartu';
    }
    if(req.method == 'POST') {
        city = req.body.cityname;
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
    getWeatherDataPromise(url)
    .then(data => {
        res.render('index', data);
    });
})

// app.get('/', (req, res) => {
//     let city = 'Tartu';
//     let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
//     getWeatherDataPromise(url)
//     .then(data => {
//         res.render('index', data);
//     });
// });

// app.post('/', (req, res) => {
//     let city = req.body.cityname;
//     url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`;
//     getWeatherDataPromise(url)
//     .then(data => {
//         res.render('index', data);
//     });
// });

app.listen(3000);