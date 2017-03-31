/* -*- Mode: Javascript; indent-tabs-mode: nil; c-basic-offset: 4; tab-width: 4 -*- */
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */ 
/* 
 * discoverable.js 
 * 
 * TODO: 
 * 
 * Copyright (C) 2017 José Miguel Fonte <pmikepublic [AT] gmail [DOT] com> 
 */

// Private
var ip_addr = undefined;
var ip_port = 0;

// Public
module.exports = Discoverable;

function Discoverable(address, port, raw_message) {
	this.raw = new Buffer.from (raw_message);
	ip_addr  = address;
	ip_port  = port;
}

Discoverable.prototype.getMacAddressAsString = function () {
	var string = this.raw.toString('hex', 0, 1);
	string += ":" + this.raw.toString('hex', 1, 2);
	string += ":" + this.raw.toString('hex', 2, 3);
	string += ":" + this.raw.toString('hex', 3, 4);
	string += ":" + this.raw.toString('hex', 4, 5);
	string += ":" + this.raw.toString('hex', 5, 6);
	return string;
};

Discoverable.prototype.getIpAddressAsString = function () {
	var string = '' + this.raw[16];
	string += "." + this.raw[15];
	string += "." + this.raw[14];
	string += "." + this.raw[13];
	return string;
};

Discoverable.prototype.getPortAsString = function () {
	return (this.raw[18] << 8) + this.raw[17];
}
