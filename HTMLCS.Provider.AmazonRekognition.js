var AWS = require('aws-sdk');
var uuid = require('uuid');
var Sync = require('deasync');
var axios = require('axios');

_global.HTMLCS.providers.ar = function () {
    var self = {};

    self.downloadImage = function (url) {
        return axios
            .get(url, {
                responseType: 'arraybuffer'
            })
            .then(response => response.data)
    };

    self.isSimilarAlt = function (altText, imageSource, beStrict, compareFunc) {
        var isSimilar = true;
        try {
            var opts = null;
            var envVar = process.env["GOOGLE_APPLICATION_CREDENTIALS"]
            if (envVar && envVar.length > 0 && envVar.indexOf(".json") == -1) {
                opts = {credentials: JSON.parse(envVar)};
            }

            var client = new AWS.Rekognition({
                region: 'us-east-1'
            });
            var results = -1;


            var imageBytes = -1;
            self.downloadImage(imageSource).then(function (bytes) {
                imageBytes = bytes;
            });
            Sync.loopWhile(function () {
                return imageBytes === -1;
            });

            client.detectLabels({
                Image: {
                    Bytes: imageBytes
                }
            }, function (err, data) {
                results = data;
            });
            Sync.loopWhile(function () {
                return results === -1;
            });

            if (!results) return !beStrict;

            var labels = results.Labels.map(function (label) {
                return label.Name;
            });
            isSimilar = compareFunc(labels, altText)
        } catch (e) {
            console.error('HTMLCS.providers.gcv.isSimilarAlt', e);
            if (beStrict) isSimilar = false;
        }

        return isSimilar;

    };


    return self;

}();
