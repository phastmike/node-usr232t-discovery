/* -*- Mode: Javascript; indent-tabs-mode: nil; c-basic-offset: 4; tab-width: 4 -*- */
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */ 
/* 
 * webserver.vala 
 * 
 * TODO: 
 * 
 * Copyright (C) 2017 José Miguel Fonte <pmikepublic [AT] gmail [DOT] com> 
 */

const http = require('http');
const url = require('url');
var server_web = undefined;
var server_port = 0;
var devices = [];

function getDevicesAsJson() {
    return JSON.stringify (devices);
}

function getDevicesAsText() {
    let output = 'Discovery has found ' + devices.length + ' devices.\n';

	for (let i = 0; i < devices.length; i++) {
	    output = output + devices[i].getIpAddressAsString()
		    + ':'
			+ devices[i].getPortAsString()
			+ ' ['
			+ devices[i].getMacAddressAsString()
			+ '] '
			+ (devices[i].isNewFirmware() ? '*' : '')
			+ '\n';
	}

    return output;
}

function getDevicesWithFormat(format) {
    switch (format) {
        case 'json':
            return getDevicesAsJson();
        default:
            return getDevicesAsText();
    }
}

function handleRequest(request, response) {
    let req = url.parse(request.url.toLowerCase(), true)
	switch (req.pathname) {
		case '/gateways':
		case '/gateways/':
            response.write(getDevicesWithFormat(req.query.format));
			response.end ();
			break;
		case '/gateways/json':
		case '/gateways/json/':
			response.write (getDevicesAsJson());
			response.end ();
			break;
		default:
			response.end ('404 - ' + request.url + ' Not found');
			break;
	}
}

module.exports = WebServer;

function WebServer(port) {
	server_port = port;
	server_web = http.createServer(handleRequest);
};

WebServer.prototype.start = function () {
	server_web.listen(server_port, function() {
		console.log ("Server Web on : http://localhost:%s", server_port);
	});
};

WebServer.prototype.set_devices = function (ds) {
	devices = ds;
}
