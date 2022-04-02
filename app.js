require('dotenv').config();

const http = require('http');
const dns = require('dns');
const ping = require('ping');

const env_config =  require('./config.js');
const yaml_config = require('node-yaml-config');

const config = yaml_config.load(__dirname + process.env.CONFIG);
// console.log(config)

const pingCfg = { timeout: 10, extra: ['-i', '2'] };
const roles = Object.values(config.targets)

// ====================================================================

// Current loads
console.log(`NODE_ENV=${process.env.NODE_ENV}`);
console.log(`ENV: ${process.env.CONFIG}`)

// https://millermedeiros.github.io/mdoc/examples/node_api/doc/dns.html
function getIP(host){
    dns.resolve4(host, function (err, addresses) {
        if (err) throw err;

        // console.log('addresses: ' + JSON.stringify(addresses));
        addresses.forEach(function (a) {
            ping.promise.probe(a, pingCfg).then(function (res) {
                // console.log(`Host: ${res.inputHost}. Average: ${res.avg}`);

                dns.reverse(res.inputHost, function (err, domains) {
                    if (err) {
                        console.log(`Host: ${host}. IP: ${res.inputHost}. Host name: (not found). Average: ${res.avg}`)
                    } else {
                        console.log(`Host: ${host}. IP: ${res.inputHost}. Host name: ${domains}. Average: ${res.avg}`)
                    }

                });

            });
        });
    });
}

// ====================================================================

roles.forEach((role) => {
    getIP(role.domain)
})



