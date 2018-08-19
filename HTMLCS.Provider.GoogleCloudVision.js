var vision = require('@google-cloud/vision');
var Sync = require('deasync');

_global.HTMLCS.providers.gcv = function () {
    var self = {};


    self.isSimilarAlt = function (altText, imageSource, beStrict, compareFunc) {
        console.log('HTMLCS.Provider.GoogleCloudVision', altText, imageSource, beStrict);
        var isSimilar = true;
        try {
            var opts = null;
            var envVar = process.env["GOOGLE_APPLICATION_CREDENTIALS"];
            if (envVar && envVar.length > 0 && envVar.indexOf(".json") === -1){
                opts = {credentials: JSON.parse(envVar)};
            }

            var client = new vision.ImageAnnotatorClient(opts);
            var results = -1;

            client.labelDetection(imageSource).then(function (res) {
                results = res;
            });
            Sync.loopWhile(function () {
                return results === -1;
            });

            var labels = results[0].labelAnnotations.map(function (annotation) {
                return annotation.description;
            });
            isSimilar = compareFunc(labels, altText)
        } catch (e) {
            console.error('HTMLCS.Provider.GoogleCloudVision.isSimilarAlt.error', e);
            if (beStrict) isSimilar = false;
        }
        console.log('HTMLCS.Provider.GoogleCloudVision.isSimilarAlt.result', isSimilar);
        return isSimilar;
    };


    return self;

}();
