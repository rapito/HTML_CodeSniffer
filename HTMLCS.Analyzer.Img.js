_global.HTMLCS.analyzer.img = function () {
    var self = {};

    self.on = function () {
        self.PROVIDERS_ON = true;
    };

    self.off = function () {
        self.PROVIDERS_ON = false;
    };

    self.providers = function () {
        if (!self.PROVIDERS_ON) return [];
        return [
            _global.HTMLCS.providers.ar,
            _global.HTMLCS.providers.gcv,
        ];
    };

    self.processor = {
        isSimilarAlt: function (altText, imageSource, beStrict) {
            var result = false;
            if(!self.providers() || self.providers().length === 0) return !beStrict;
            self.providers().forEach(function (provider) {
                if (result) return;
                result = result || provider.isSimilarAlt(altText, imageSource, beStrict, self.isSimilarTagsToAlt);
            });

            return result;
        }
    };

    self.isSimilarTagsToAlt = function (tags, altText) {
        if (!tags) return false;
        if (!altText) return false;
        var isSimilar = false;
        var alts = altText.split(" ");

        tags.forEach(function (tag) {
            if (isSimilar) return;

            alts.forEach(function (alt) {
                if (isSimilar) return;

                isSimilar = isSimilar || alt.toLowerCase() === tag.toLowerCase();
            });
        });

        return isSimilar;
    };

    /**
     * Verifies that the alternate text on an element matches
     * the image content by using available Image Analyzer
     * providers powered by Machine Learning.
     *
     * @param {String} altText  The alt text of the element.
     * @param {String} imageSource  The image source URL to pass to the provider.
     * @param {Boolean} beStrict If true, then any error will cause this method to return false.
     *
     * @returns {Boolean} Determines if the alt text is similar or not.
     */
    self.isSimilarAlt = function (altText, imageSource, beStrict) {
        if (!altText && !beStrict) return true;
        if (!imageSource && !beStrict) return true;

        var isSimilar = false;

        isSimilar = self.processor.isSimilarAlt(altText, imageSource, beStrict);

        return isSimilar;
    };

    self.on();

    return self;
}();
