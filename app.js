require('dotenv').config();

const os = require("os");
const fs = require('fs');
const path = require('path')

const http = require('http');
const dns = require('dns');
const ping = require('ping');

const env_config =  require('./config.js');
const yaml_config = require('node-yaml-config');

console.log(`NODE_ENV=${process.env.NODE_ENV}`);
console.log(`ENV: ${process.env.CONFIG}`)

const config = yaml_config.load(__dirname + process.env.CONFIG);
// console.log(config)

const pingCfg = { timeout: 10, extra: ['-i', '2'] };

const hosts = ['49.12.234.130', '212.19.134.52', 'bld.sys-adm.in'];
const domainList = ['bld.sys-adm.in', 'dns.the-ant.net']

const targets = config.targets.roles;


// hosts.forEach(function (host) {
//         ping.promise.probe(host, pingCfg).then(function (res) {
//         // console.log(res);
//     });
// });

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

// console.log(targets);

// for (const [key, roles] of Object.entries(targets)) {
//     // console.log(`${key}: ${roles}`);

//     var role = config.targets.roles
    
//     var server = config.targets.role

//     console.log(server);

// }

// Get lenght of object
function length(obj){
    if (typeof obj==='object' && obj!== null){return Object.keys(obj).length;}
    // if (Array.isArray){return obj.length;}
    return obj.length;

}

let roles = Object.values(config.targets)

roles.forEach((role) => {
    console.log(role.domain);
    getIP(role.domain)
})


var num_roles = length(roles);
let index = 0;
// while (index < num_roles) {
    
//     // var role = Object.keys(roles)[index]
//     var role = Object.keys(`${config.targets.role}`)
//     console.log(role);

    

//     index += 1;
//   }

// roles.forEach(function (role) {
//     var server = config.targets.role[1]
//     console.log(server);
//     // console.log(config.targets.role1.domain_name);

// })

//     console.log(config.targets.roles);
// })



// domainList.forEach(function (host) {
//     getIP(host)
// });

// (async function () {
//
//     const result = await ping.promise.probe('www.kindacode.com', {
//         timeout: 10,
//         extra: ["-i", "2"],
//     });
//     // console.log(result);
//
//     if (result.avg > 300){
//         console.log(`AAAAAA`)
//     } else {
//         console.log(result.avg)
//     }
//
// })();

