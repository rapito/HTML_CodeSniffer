const fs = require('fs');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const cs = require('../../build/HTMLCS.js')
const {HTMLCS} = cs

var testfile, address, standard, reportType;

var messages = [];
var testData = {
    name: '',
    standard: '',
    assertions: []
};

// Default reporter.
var reportDefaultFn = function () {
    var assertion, thisMsg;
    for (var assert = 0; assert < testData.assertions.length; assert++) {
        assertion = testData.assertions[assert];
        for (var i = 0; i < messages.length; i++) {
            thisMsg = messages[i];
            if (assertion.level.toLowerCase() === thisMsg[0].toLowerCase()) {
                if (assertion.code.test(thisMsg[1]) === true) {
                    if (assertion.id === thisMsg[3]) {
                        assertion.triggered = true;
                    } else if (assertion.id === null) {
                        assertion.triggered = true;
                    }
                }
            }
        }
    }

    var failures = 0;
    console.info('Results for ' + testData.name + ' (' + testData.standard + '):');
    for (var assert = 0; assert < testData.assertions.length; assert++) {
        assertion = testData.assertions[assert];
        if (assertion.triggered !== assertion.expected) {
            console.info('  [FAIL] ' + assertion.line);
            failures++;
        } else {
            console.info('  [ OK ] ' + assertion.line);
        }
    }

    var retval = 0;
    if (failures === 0) {
        console.info('OK');
    } else {
        console.info('FAILURES!');
        retval = 1;
    }

    console.info('Assertions: ' + testData.assertions.length + ', Passed: ' + (testData.assertions.length - failures) + ', Failed: ' + failures);
    process.exit(retval);
};

if (process.argv.length < 3 || process.argv.length > 3) {
    console.log('Usage: node HTMLCS_Node_Test.js test_name');
    process.exit(255);
} else {
    testfile = process.argv[2];
    if (testfile.substr(-5) !== '.html') {
        testfile += '.html';
    }
    address = 'file://' + '../../' + 'Tests/' + testfile;
    var content = fs.readFileSync('../../Tests/' + testfile, {encoding: 'utf-8'})

    if (!content) {
        console.log('Test file ' + testfile + ' doesn\'t exist?');
        process.exit(2);
    } else {
        var indexStart = content.indexOf('<!-- @HTMLCS_Test@\n');
        if (indexStart === -1) {
            console.log('No HTMLCS_Test banner?');
            process.exit(2);
        }
        var indexEnd = content.indexOf('\n-->', indexStart + 1);

        var testContent = content.substr(indexStart, indexEnd - indexStart);
        var testContent = testContent.split("\n");
        testContent.splice(0, 1);

        for (var i = 0; i < testContent.length; i++) {
            var words = testContent[i].split(' ');
            switch (words[0]) {
                case 'Name:':
                    testData.name = words.slice(1, words.length).join(' ');
                    break;

                case 'Standard:':
                    testData.standard = words.slice(1, words.length).join(' ');
                    break;

                case 'Assert:':
                    var assertion = {
                        line: null,
                        expected: true,
                        level: null,
                        code: null,
                        id: null,
                        triggered: false
                    };

                    // Get rid of "Assert";
                    words.shift();

                    assertion.line = words.join(' ');

                    if (words[0].toLowerCase() === 'no') {
                        words.shift();
                        assertion.expected = false;
                    }
                    assertion.level = words.shift().toUpperCase();
                    assertion.code = words.shift();
                    assertion.code = assertion.code.replace('.', '\\.');
                    assertion.code = assertion.code.replace('*', '.*');
                    assertion.code = new RegExp('^' + assertion.code + '$');

                    if (words[0].toLowerCase() === 'on') {
                        words.shift();
                        assertion.id = words.shift();
                    }

                    testData.assertions.push(assertion);
                    break;
            }//end switch
        }//end for
    }//end if


    const dom = new JSDOM(content);
    window = dom.window;
    document = dom.window.document;

    // Override console.log function for outputting.
    console.logOld = console.log; // keeping original function under new name
    console.log = function() {
        var args = Array.prototype.splice.call(arguments, 0);
        console.logOld.apply(this, args);

        var msg = args[0] || arguments[0]
        var thisMsg;
        if (msg.indexOf('[HTMLCS] ') === 0) {
            thisMsg = msg.substr(9, msg.length).split('|');
            messages.push(thisMsg);
        } else if (msg === 'done') {
            reportDefaultFn();
        }
    };

    // Now Run. Note that page.evaluate() function is sanboxed to
    // the loaded page's context. We can't pass any variable to it.
    switch (testData.standard) {
        case 'WCAG2A':
        case 'WCAG2AA':
        case 'WCAG2AAA':
        case 'Section508':
            cs.HTMLCS_RUNNER.run(testData.standard, function(messages, error){
                console.log('Super done', messages, error)
            });
            break;
        default:
            console.log('Unknown standard.');
            process.exit(2);
            break;
    }


}
;


