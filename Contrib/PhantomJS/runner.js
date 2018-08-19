var HTMLCS_RUNNER = _global.HTMLCS_RUNNER = new function () {
    this.run = function (standard, callback) {
        var self = this;

        HTMLCS = _global.HTMLCS || HTMLCS;
        // At the moment, it passes the whole DOM document.
        HTMLCS.process(standard, document, function () {
            var messages = HTMLCS.getMessages();
            var length = messages.length;
            var msgCount = {};
            msgCount[HTMLCS.ERROR] = [];
            msgCount[HTMLCS.WARNING] = [];
            msgCount[HTMLCS.NOTICE] = [];

            for (var i = 0; i < length; i++) {
                msgCount[messages[i].type].push(self.output(messages[i]));
            }
            if (callback) callback(messages, null)
            console.log('done');
        }, function () {
            var error = 'Something in HTML_CodeSniffer failed to parse. Cannot run.';
            console.log(error);
            if (callback) callback(null, error)
            console.log('done');
        }, 'en');
    };

    this.output = function (msg) {
        // Simple output for now.
        var typeName = 'UNKNOWN';
        switch (msg.type) {
            case HTMLCS.ERROR:
                typeName = _global.HTMLCS.getTranslation("auditor_error");
                break;

            case HTMLCS.WARNING:
                typeName = _global.HTMLCS.getTranslation("auditor_warning");
                break;

            case HTMLCS.NOTICE:
                typeName = _global.HTMLCS.getTranslation("auditor_notice");
                break;
        }//end switch

        var nodeName = '';
        if (msg.element) {
            nodeName = msg.element.nodeName.toLowerCase();
        }

        var elementId = '';
        if (msg.element.id && (msg.element.id !== '')) {
            elementId = '#' + msg.element.id;
        }

        // Clone the node to get it's outerHTML (with inner replaced with ... for brevity)
        var html = '';
        if (msg.element.outerHTML) {
            var node = msg.element.cloneNode(true);
            node.innerHTML = '...';
            html = node.outerHTML;
        }
        var s = '[HTMLCS] ' + typeName + '|' + msg.code + '|' + nodeName + '|' + elementId + '|' + msg.msg + '|' + html;
        console.log(s);
        return s;
    };

};