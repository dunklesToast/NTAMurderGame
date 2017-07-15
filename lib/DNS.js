/**
 * Created by dunklesToast on 16.07.2017.
 */
const dns = require('node-dns'),
    tcpserver = dns.createTCPServer(),
    server = dns.createServer(),
    ndns = require('dns'),
    fs = require('fs');

let onMessage = function (request, response) {
    try {
        console.log(request.address.address + ' asked for ' + request.question[0].name + ' with an ' + request.question[0].type);
        let dnstype;
        if (request.question[0].type == 1) dnstype = "A";
        ndns.resolve(request.question[0].name, dnstype, function (err, address, smth) {
            if(err){
                console.log(err);
                response.answer.push(dns.A({
                    name: request.question[0].name,
                    address: null,
                    ttl: 600,
                }));
            }
            console.log('ADDRESS IS: ' + address);
            response.answer.push(dns.A({
                name: request.question[0].name,
                address: address,
                ttl: 600,
            }));
            response.send();
        });
    }catch (e){
        console.log('ERROR: ' + e.message);
    }

};

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