function WS(url, opencallback, closecallback, messagehandler) {
    this.doclose = false;
    this.uid = 1;
    this.callback_pool = {};
    this.url = url;
    this.ws = null;
    this.opencallback = opencallback;
    this.closecallback = closecallback;
    this.messagehandler = messagehandler;
}
WS.prototype.disconnect = function() {
    this.doclose = true;
    this.ws && this.ws.close && this.ws.close();
}
WS.prototype.connect = function() {
    let self = this;
    this.doclose = false;
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = this.opencallback;
    this.ws.onclose = function() {
        if (self.closecallback) {
            self.closecallback();
        }
        if (!self.doclose) {
            setTimeout(function() {
                self.connect();
            }, 2000);
        }
    }
    this.ws.onmessage = function(data) {
        console.debug('websocket <', data);
        let jsondata = JSON.parse(data.data);
        if (jsondata['_uid'] !== undefined) {
            self.callback_pool[self.jsondata['_uid']](jsondata);
            delete self.callback_pool[jsondata['_uid']];
        } else if (self.messagehandler) {
            self.messagehandler(jsondata);
        }
    }
}
WS.prototype.sendMessage = function(data, callback) {
    console.debug('websocket >', data);
    if (this.ws.readyState) {
        let senddata = data;
        if (callback !== undefined) {
            let currentid = this.uid++;
            senddata['_uid'] = currentid;
            this.callback_pool[currentid] = callback;
        }
        this.ws.send(JSON.stringify(data));
    }
}
