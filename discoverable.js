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
function setMacFromRawData(raw) {
	var string = raw.toString('hex', 0, 1);
	string += ":" + raw.toString('hex', 1, 2);
	string += ":" + raw.toString('hex', 2, 3);
	string += ":" + raw.toString('hex', 3, 4);
	string += ":" + raw.toString('hex', 4, 5);
	string += ":" + raw.toString('hex', 5, 6);

    return string;
};

function setIpAddressFromRawData(raw) {
	var string = '' + raw[16];
	string += "." + raw[15];
	string += "." + raw[14];
	string += "." + raw[13];

	return string;
};

function setIpPortFromRawData(raw) {
	return ((raw[18] << 8) + raw[17]).toString();
}

function setNewFwFromRawData(raw) {
	return raw.length == 35;
}

// Public
module.exports = Discoverable;

function Discoverable(address, port, raw_message) {
	this.raw = new Buffer.from (raw_message);

    this.mac_addr = setMacFromRawData(this.raw);
    this.ip_addr = setIpAddressFromRawData(this.raw);
    this.ip_port = setIpPortFromRawData(this.raw);
    this.nufw = setNewFwFromRawData(this.raw);
}

Discoverable.prototype.getMacAddressAsString = function () {
	return this.mac_addr;
};

Discoverable.prototype.getIpAddressAsString = function () {
    return this.ip_addr;
};

Discoverable.prototype.getPortAsString = function () {
    return this.ip_port;
}

Discoverable.prototype.isNewFirmware = function () {
	return this.nufw;
}
