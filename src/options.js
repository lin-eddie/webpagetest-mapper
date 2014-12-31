/*globals require, module */

'use strict';

var check, path, fs, defaults, defaultConfig;

check = require('check-types');
path = require('path');
fs = require('fs');

defaults = {
    uri: 'www.webpagetest.org',
    location: 'Dulles:Chrome',
    connection: 'Native Connection',
    tests: 'tests.json',
    count: 9
};

defaultConfig = '.wptrc';

module.exports = {
    cli: [
        {
            format: '-u, --uri <URI>',
            description: 'the base URI of the WebPageTest instance, default is `' + defaults.uri + '`'
        },
        {
            format: '-k, --key <key>',
            description: 'the WebPageTest API key'
        },
        {
            format: '-l, --location <location>',
            description: 'the WebPageTest location, default is `' + defaults.location + '`'
        },
        {
            format: '-c, --connection <connection>',
            description: 'the WebPageTest connection speed, default is `' + defaults.connection + '`'
        },
        {
            format: '-t, --tests <path>',
            description: 'path to the test definitions file, default is `./' + defaults.tests + '`'
        },
        {
            format: '-n, --count <number>',
            description: 'the number of times to run each test, default is `' + defaults.count + '`',
            coercion: parseInt
        },
        {
            format: '-e, --email <address>',
            description: 'the email address to notify when tests are finished'
        },
        {
            format: '-o, --output <path>',
            description: 'the file to write the mapped output to, default is stdout'
        },
        {
            format: '-d, --dump <path>',
            description: 'dump intermediate results to a file for later processing'
        },
        {
            format: '-r, --results <path>',
            description: 'read intermediate results from a file, skips running the tests'
        },
        {
            format: '-f, --config <path>',
            description: 'read configuration options from a file, default is `./' + defaultConfig + '`'
        }
    ],
    normalise: normalise
};

function normalise (options) {
    if (!options.normalised) {
        populateObject(options, readJSON(options.config, defaultConfig));
        populateObject(options, defaults);

        options.tests = readJSON(options.tests, defaults.tests);
        options.normalised = true;
    }
}

function readJSON (jsonPath, defaultFileName) {
    check.assert.unemptyString(defaultFileName);

    if (check.not.unemptyString(jsonPath)) {
        jsonPath = defaultFileName;
    }

    jsonPath = path.resolve(jsonPath);

    if (fs.existsSync(jsonPath) && fs.statSync(jsonPath).isFile()) {
        return JSON.parse(fs.readFileSync(jsonPath), { encoding: 'utf8' });
    }

    return {};
}

function populateObject (object, defaultValues) {
    check.assert.object(object);
    check.assert.object(defaultValues);

    Object.keys(defaultValues).forEach(function (key) {
        if (check.not.assigned(object[key])) {
            object[key] = defaultValues[key];
        }
    });
}

