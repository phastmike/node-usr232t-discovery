/* -*- Mode: Javascript; indent-tabs-mode: nil; c-basic-offset: 4; tab-width: 4 -*- */
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */ 
/* 
 * webserver.vala 
 * 
 * TODO: 
 * 
 * Copyright (C) 2017 José Miguel Fonte <pmikepublic [AT] gmail [DOT] com> 
 */

var http = require('http');
var server_web = undefined;
var server_port = 0;
var devices = undefined;

function handleRequest(request, response) {
	switch (request.url.toLowerCase()) {
		case '/gateways':
		case '/gateways/':
			response.write('Discovery has found ' + devices.length + ' devices. Path Hit: ' + request.url + '\n');
			for (let i = 0; i < devices.length; i++) {
				response.write('' + devices[i].getIpAddressAsString() 
					+ ':' 
					+ devices[i].getPortAsString() 
					+ ' [' 
					+ devices[i].getMacAddressAsString() 
					+ '] ' 
					+ (devices[i].isNewFirmware() ? '*' : '') 
					+ '\n');
			}
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
