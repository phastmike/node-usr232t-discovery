/* -*- Mode: Javascript; indent-tabs-mode: nil; c-basic-offset: 4; tab-width: 4 -*- */
/* vim: set tabstop=4 softtabstop=4 shiftwidth=4 expandtab : */ 
/* 
 * main.js 
 * 
 * TODO: 
 * 
 * Copyright (C) 2017 José Miguel Fonte <pmikepublic [AT] gmail [DOT] com> 
 */

var Discovery = require('./discovery.js');
var discovery = new Discovery();

discovery.start();

var WebServer = require('./webserver.js');
var webserver = new WebServer (8080);

webserver.start ();

// work
discovery.on('deviceFound', () => {
        console.log ('SIGNAL EMITTED: ' + discovery.devices_found.length);
        webserver.set_devices (discovery.devices_found);
    });

discovery.scanDevices();
setInterval(function () {
        discovery.scanDevices();
    }, 10000);
