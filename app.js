require('dotenv').config();

const color = require('simple-log-color')

const http = require('http');
const dns = require('dns');
const ping = require('ping');

const env_config =  require('./config.js');
const yaml_config = require('node-yaml-config');

const config = yaml_config.load(__dirname + process.env.CONFIG);
// console.log(config)

const pingCfg = { timeout: 10, extra: ['-i', '2'] };
const roles = Object.values(config.targets)

const average = config.average

// ====================================================================

var args = 'host';

// Function to Sort the Data by given Property (args = host)
function sortByProperty(property) {
    return function (a, b) {
        var sortStatus = 0,
            aProp = a[property].toLowerCase(),
            bProp = b[property].toLowerCase();
        if (aProp < bProp) {
            sortStatus = -1;
        } else if (aProp > bProp) {
            sortStatus = 1;
        }
        return sortStatus;
    };
}

// Current loads
console.log(`NODE_ENV=${process.env.NODE_ENV}`);
console.log(`ENV: ${process.env.CONFIG}`)

var allTrees = []
function Tree(host, ip, name, average) {
    this.host   = host
    this.ip     = ip
    this.name   = name
    this.average= average
  }

// https://millermedeiros.github.io/mdoc/examples/node_api/doc/dns.html
let index = 0;
function getIP(host){

    // Checki is alive
    ping.sys.probe(host, function(isAlive){
        var msg = ''

        if (isAlive) {
            msg = 'host ' + host + ' is alive'

            dns.resolve4(host, function (err, addresses) {
                if (err) throw err;
        
                // console.log('addresses: ' + JSON.stringify(addresses));
                addresses.forEach(function (a) {
                    ping.promise.probe(a, pingCfg).then(function (res) {
        
                        // console.log(`Host: ${res.inputHost}. Average: ${res.avg}`);
                        var r = ''
                        var h = []
                        dns.reverse(res.inputHost, function (err, domains) {
                            if (err) {
                                // console.log(`Host: ${host}. IP: ${res.inputHost}. Host name: (not found). Average: ${res.avg}`)
                                h = new Tree(host, res.inputHost, '(not found)', res.avg)
                                r = `Role: ${host}. IP: ${res.inputHost}. Host: (not found).`
                            } else {
                                // console.log(`Host: ${host}. IP: ${res.inputHost}. Host name: ${domains}. Average: ${res.avg}`)
                                h = new Tree(host, res.inputHost, domains, res.avg)
                                r = `Role: ${host}. IP: ${res.inputHost}. Host: ${domains}.`
                            }
                            // TODO: Global arr (or database) for results
                            allTrees.push(h)
                            // console.log(allTrees);
        
                            // Generate action if average less than 
                            if (res.avg > average) {
                                console.log(color.Blue, `${r} Average: ${res.avg} (> ${average})`);
                            } else {
                                console.log(color.Green, `${r} Average: ${res.avg} (< ${average})`);
                            }
                        });
                        index++
                    });
                });
                
            });

        } else {
            msg = 'host ' + host + ' is dead'
            console.log(color.Yellow, `Role: ${host}. IP: NoN. Host: NoN. Average: NoN`);
        }

        console.log(msg);

    });
    
}

// ====================================================================

roles.forEach((role) => {
    getIP(role.domain)
})



