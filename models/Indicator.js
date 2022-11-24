const mongoose = require('mongoose')

const IndicatorSchema = new mongoose.Schema({
  indicator: String,
    mfo: Number,
    level: String,
    items: String,
    D2017_10_01: {type: Number, default: 0},
    D2018_01_01: {type: Number, default: 0},
    D2018_04_01: {type: Number, default: 0},
    D2018_07_01: {type: Number, default: 0},
    D2018_10_01: {type: Number, default: 0},
    D2019_01_01: {type: Number, default: 0},
    D2019_04_01: {type: Number, default: 0},
    D2019_07_01: {type: Number, default: 0},
    D2019_10_01: {type: Number, default: 0},
    D2020_01_01: {type: Number, default: 0},
    D2020_04_01: {type: Number, default: 0},
    D2020_07_01: {type: Number, default: 0},
    D2020_09_01: {type: Number, default: 0},
    D2020_10_01: {type: Number, default: 0},
    D2021_01_01: {type: Number, default: 0},
    D2022_01_01: {type: Number, default: 0},
    D2022_07_01: {type: Number, default: 0}
})

module.exports = mongoose.model('Indicator', IndicatorSchema) 