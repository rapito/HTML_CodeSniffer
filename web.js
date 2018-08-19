const express = require('express')
const app = express()
const path = require("path");
const multer = require("multer");
const fs = require('fs');
const upload = multer({dest: 'uploads/'});
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const cs = require(__dirname + '/build/HTMLCS.js');
const {HTMLCS} = cs;

function rel(dir) {
    return path.join(__dirname + '/' + dir);
}

function template(dir) {
    return rel('Templates/' + dir);
}

app.use(express.json({limit: '2mb'}));

app.get('/', function (req, res) {
    res.sendFile(template('index.html'))
});

app.post('/analyze', upload.single('file'), function (req, res, next) {
    var html = null;
    var filepath = null;
    var standard = 'WCAG2AAA';

    if (req.file) {
        filepath = rel(req.file.path)
        html = fs.readFileSync(filepath, 'utf8');
    } else if (req.body) {
        html = req.body.file
    }

    if (!html)
        res.send('401');

    const dom = new JSDOM(html);
    window = dom.window;
    document = dom.window.document;

    if(true || process.env.ANALYZER){
        console.log('analyzer is on!');
        cs.HTMLCS.analyzer.img.on();
    } else {
        console.log('analyzer is off!');
        cs.HTMLCS.analyzer.img.off();
    }

    cs.HTMLCS_RUNNER.run(standard, function (messages, error) {
        res.send({
            messages: messages.map(function (msg) {
                msg.element = msg.element.outerHTML;
                return msg;
            }), error: error
        });
    }, true);
    if (filepath) fs.unlink(filepath);
});

var port = process.env.PORT || 3000;

app.listen(port);
console.log('listening now!');