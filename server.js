const express = require('express');
const server = express();
//process.env.PORT ||
const PORT =  3017;
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const pg = require('pg');
const apikey = process.env.apikey;
server.use(express.json());
const client = new pg.Client(process.env.databaseURL)

server.get('/trending', trendingHandler)

function trendingHandler(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apikey}&language=en-US`;

    try {
        axios.get(url)
            .then(result => {
                let mapResult = result.data.results.map(item => {
                    let singleMovie = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return singleMovie;
                })
                res.send(mapResult)

            })
            .catch((error) => {
                console.log('error', error)
                res.status(500).send(error);
            })

    }
    catch (error) {
        errorHandler(error, req, res, next)
    }


}

function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function errorHandler(error, req, res, next) {
    const err = {
        status: 500,
        message: error
    }
    res.status(500).send(err)

}

client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(PORT)
        });
    });