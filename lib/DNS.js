/**
 * Created by dunklesToast on 16.07.2017.
 */
const dns = require('node-dns');
const tcpserver = dns.createTCPServer();
const server = dns.createServer();
const ndns = require('dns');
const fs = require('fs');
const native_dns = require('native-dns');
const db = require('../murder/Database');


let onMessage = function (request, response) {
    try {
        /**
         * What Type of record is this? (A, AAAA, MX and so on)
         */
        const DNSRequestType = native_dns.consts.QTYPE_TO_NAME[request.question[0].type];
        /**
         * The requested domain: google.de, translate.google.de
         */
        const RequestedDomain = request.question[0].name;

        /**
         * Redirect to our Mörder Server
         */
        if (RequestedDomain == 'xn--mrder-jua.spiel' || RequestedDomain == 'mC6rder.spiel' || RequestedDomain == 'moerder.spiel') {
            console.log('THATS THE MÖRDER ADDRESS');
            response.answer.push(dns[DNSRequestType]({
                name: RequestedDomain,
                address: '46.38.245.217',
                ttl: 600,
            }));
            response.send();
        } else {
            ndns.resolve(request.question[0].name, DNSRequestType, function (err, address) {
                if (err) {
                    response.answer.push(dns[DNSRequestType]({
                        name: RequestedDomain,
                        address: null,
                        ttl: 600,
                    }));
                } else if (address) {
                    response.answer.push(dns[DNSRequestType]({
                        name: RequestedDomain,
                        address: address[0],
                        ttl: 600,
                    }));
                } else {
                    response.answer.push(dns[type]({
                        name: RequestedDomain,
                        address: null,
                        ttl: 600,
                    }));
                }
                try {
                    response.send();
                    addURL(RequestedDomain, request.address.address);
                } catch (e) {
                    //ignore
                }
            });
        }
        addURL(RequestedDomain, request.address.address);
        const splitted = RequestedDomain.split('.');
        if (splitted.length == 2) {
            addDomain(splitted[1] + splitted[2], request.address.address);
        } else {
            addDomain(RequestedDomain, request.address.address);
        }
    } catch (e) {
        console.log('ERROR in DNS: ' + e.message);
        console.log(e);
    }

};

function addURL(url, ip) {
    db.addURLToDNS(url, ip).then((res) => {
        //worked
    }).catch((err) => {
        console.log('----------');
        console.log('Error while adding URL to DB');
        console.log(err.message);
        console.log('----------');
    })
}

function addDomain(domain, ip) {
    db.addDomainToDNS(domain, ip).then((res) => {
        //worked
    }).catch((err) => {
        console.log('----------');
        console.log('Error while adding Domain to DB');
        console.log(err.message);
        console.log('----------');
    })
}

let onError = function (err, buff, req, res) {
    console.log(err.stack);
};

let onListening = function () {
    console.log('server listening on', this.address());
    //this.close();
};

let onSocketError = function (err, socket) {
    console.log(err);
};

let onClose = function () {
    console.log('server closed', this.address());
};

server.on('request', onMessage);
server.on('error', onError);
server.on('listening', onListening);
server.on('socketError', onSocketError);
server.on('close', onClose);

server.serve(53, '0.0.0.0');

tcpserver.on('request', onMessage);
tcpserver.on('error', onError);
tcpserver.on('listening', onListening);
tcpserver.on('socketError', onSocketError);
tcpserver.on('close', onClose);

tcpserver.serve(53, '0.0.0.0');