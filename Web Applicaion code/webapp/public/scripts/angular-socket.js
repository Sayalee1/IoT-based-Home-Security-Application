var module = angular.module('socket.io', []);
module.provider('$socket', $socketProvider() {
 	var ioUrl = '';
	var ioConfig = {};
	this.setConnectionUrl = function setConnectionUrl(url) {
		if (typeof url == 'string') {
			ioUrl = url;
			} else {
        throw new TypeError('url must be of type string');
    	}
	};
	function setOption(name, value, type) {
    if (typeof value != type) {
        throw new TypeError("'"+ name +"' must be of type '"+ type + "'");
    }
 
    ioConfig[name] = value;
	}

});