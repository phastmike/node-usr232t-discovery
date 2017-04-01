/* -*- Mode: Javascript; indent-tabs-mode: nil; c-basic-offset: 4; tab-width: 4 -*- */
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */ 
/* 
 * discovery.js 
 * 
 * TODO: 
 * 
 * Copyright (C) 2017 José Miguel Fonte <pmikepublic [AT] gmail [DOT] com> 
 */

var   Util = require('util');
const EventEmmiter = require('events');
var   Discoverable = require('./discoverable.js');

// Private
const PORT_UDP = 1500;
const BROADCAST_ADDR = '255.255.255.255';
const dgram = require('dgram');
var   server_udp = undefined;

// Public
module.exports = Discovery;

function Discovery() {
    this.devices_found = [];
    server_udp = dgram.createSocket('udp4');

    // Extend Array
    Array.prototype.contains = function(obj) {
        var i = this.length;

        while (i--) {
            if (this[i].getMacAddressAsString () == obj.getMacAddressAsString ()) {
                return true;
            }
        }
        return false;
    }

    Array.prototype.getIndex = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i].getMacAddressAsString () == obj.getMacAddressAsString ()) {
                return i;
            }
        }
        return -1;
    }
}

Util.inherits (Discovery, EventEmmiter);

Discovery.prototype.start = function () {
    server_udp.on('listening', () => {
        var address = server_udp.address();
        console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });

    server_udp.on('message', (message, remote) => {
        console.log(remote.address + ':' + remote.port +' - ' + message.toString('hex'));
        if (message.length == 28 || message.length == 35) {
            let nugw = new Discoverable(remote.address, remote.port, message);
            if (this.devices_found.contains (nugw)) {
                let index = this.devices_found.getIndex(nugw);
                if (index != -1 && this.devices_found[index].isNewFirmware() == false && nugw.isNewFirmware()) {
                    this.devices_found[index].raw = new Buffer.from(nugw.raw);
                }
            } else {
                this.devices_found.push (nugw);
                console.log ('There are ' + this.devices_found.length + ' devices on the list');
                this.emit ('deviceFound');
            }
        }
    });

    server_udp.bind(PORT_UDP, () => {
        server_udp.setBroadcast(true);
    });
};

Discovery.prototype.scanDevices = function () {
    var message = new Buffer('1234567890123456789012345678901234567890');

    server_udp.send(message, 0, message.length, PORT_UDP, BROADCAST_ADDR, (err, bytes) => {
        if (err) throw err;
        console.log('UDP message sent ' + bytes + ' bytes to ' + BROADCAST_ADDR +':'+ PORT_UDP);
    });

    server_udp.send(message, 0, message.length-1, PORT_UDP, BROADCAST_ADDR, (err, bytes) => {
        if (err) throw err;
        console.log('UDP message sent ' + bytes + ' bytes to ' + BROADCAST_ADDR +':'+ PORT_UDP);
    });
};
