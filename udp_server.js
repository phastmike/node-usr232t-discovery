/* -*- Mode: Javascript; indent-tabs-mode: nil; c-basic-offset: 4; tab-width: 4 -*- */
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */ 
/* 
 * node-ipsetup.vala 
 * 
 * Version 0.1 
 * 
 * TODO: 
 * 
 * Copyright (C) 2017 José Miguel Fonte <pmikepublic [AT] gmail [DOT] com> 
 */

const PORT_WEB = 8080;
const PORT_UDP = 1500;
const BROADCAST_ADDR = '255.255.255.0';

const http = require('http')
const dgram = require('dgram');

var server_udp = dgram.createSocket('udp4');

server_udp.on('listening', function () {
    var address = server_udp.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server_udp.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);

});

server_udp.bind(PORT_UDP, () => {
	server_udp.setBroadcast(true);
});

var message = new Buffer('1234567890123456789012345678901234567890');
server_udp.send(message, 0, message.length, PORT_UDP, BROADCAST_ADDR, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + BROADCAST_ADDR +':'+ PORT_UDP);
});

var server_web = http.createServer(handleRequest);

server_web.listen(PORT_WEB), function() {
	console.log ("Server Web on : http://localhost:%s", PORT_WEB);
}

function handleRequest(request, response) {
	response.end('It Works!! Path Hit: ' + request.url);
}

