const { rejects } = require('assert');
const { spawnSync } = require('child_process');
const { resolve } = require('path');
// const events = require('events')

const detectFace = (filename) =>{
    let res = {}
    const python = spawnSync('python', ['ml/data_generation.py', filename]);
    if(parseInt(python.status) === 0)
       res = {code: 200, text: "completed the processing"};
    else res = {code: 400, text: "error processing the video"}

    return res;
}

module.exports = {detectFace}