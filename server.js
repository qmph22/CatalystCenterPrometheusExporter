'use strict';

const express = require('express');
const cluster = require('cluster');
const server = express();
const client = require('prom-client');
const register = client.register;
const DNAC = require('./DNAC');
const CONFIG = require('./DNAC_USER_CONFIG');

console.log(CONFIG.ip);
console.log(CONFIG.user);
console.log(CONFIG.passwd);

let dnac = new DNAC({
    host: 'https://' + CONFIG.ip,
    username: CONFIG.user,
    password: CONFIG.passwd

});

// Test Code to enable for troubleshooting DNAC interface helper
//dnac.getSites(function(sites) {
//console.log(JSON.stringify(sites));
//});

const Histogram = client.Histogram;


const Counter = client.Counter;


const Gauge = client.Gauge;

const ndcGauge = new client.Gauge({
	name: 'dnac_network_device_count',
	help: 'Network Device Count'
});

const reachabilityStatus = new Map([['Unreachable', 0], ['Reachable', 1]]);
let networkDevicesMap = new Map();

setInterval(() => {
	dnac.getNetworkDevicesCount(function(networkDevicesCount) {
//		console.log(JSON.stringify(networkDevicesCount));
		console.log("Collected network device count: " + networkDevicesCount.response);
		ndcGauge.set(networkDevicesCount.response);
	});
}, 3000);
/*
setInterval(() => {
	dnac.getEOXData(function(eoxData) {
		let eoxDataReponse = eoxData.response;
		//console.log(JSON.stringify(eoxData.response));
		console.log("Collected network device EoX Data: " + eoxDataReponse);
	});
}, 3000);
*/
setInterval(() => {
	dnac.getVLANDetails(function(vlanDetails) {
		let vlanDetailsReponse = vlanDetails.response;
		//console.log(JSON.stringify(eoxData.response));
		console.log("Collected VLAN details: " + vlanDetailsReponse);
	});
}, 3000);

const complianceStatusCountGuage = new client.Gauge({
	name: 'dnac_Compliance_Status_Count',
	help: 'STATUS Compliant Devices Count'
});

setInterval(() => {
	dnac.getComplianceStatusCount(function(complianceStatusCount) {
		let complianceStatusCountReponse = complianceStatusCount.response;
		//console.log(JSON.stringify(eoxData.response));
		console.log("Compliance status count: " + complianceStatusCountReponse);
		complianceStatusCountGuage.set(complianceStatusCountReponse);
	});
}, 3000);

const st = new client.Gauge({
	name: 'dnac_site_count',
	help: 'Site Count'
});

setInterval(() => {
	dnac.getSitesCount(function(siteCountResp) {
		console.log("Collected site count: " + siteCountResp.response);
		st.set(siteCountResp.response);
	});
}, 3000);

const networkDeviceGauge = new Gauge({
	name: 'dnac_reachabilityStatus_gauge',
	help: 'reachabilityStatus of network device',
	labelNames: ['hostname']
});
setInterval(() => {
	dnac.getNetworkDevices(function(networkDevices) {
//		console.log(JSON.stringify(networkDevices));
		let networkDevicesHostname = [];
		let networkDevicesResponse = networkDevices.response; //Returns an array of lists with each list item representing a network device. Each element in the list represents a property of the network device.
		networkDevicesResponse.forEach((returnedDevice) => {
			networkDevicesHostname.push(returnedDevice.hostname);
			if (!networkDevicesMap.has(returnedDevice)) {
				networkDevicesMap.set(returnedDevice.hostname, returnedDevice); }
		});
		console.log(`Collected network devices: ${networkDevicesHostname} in array`);

		networkDevicesMap.forEach((value, key, map) => {
				if (reachabilityStatus.get(value.reachabilityStatus) != undefined) {
					networkDeviceGauge.labels(key).set(reachabilityStatus.get(value.reachabilityStatus));
					console.log(`Reachability status of device key : ${reachabilityStatus.get(value.reachabilityStatus)}`);
				}

		});
	});
}, 3000);

const h = new Histogram({
	name: 'test_histogram',
	help: 'Example of a histogram',
	labelNames: ['code']
});

setTimeout(() => {
	h.labels('200').observe(Math.random());
	h.labels('300').observe(Math.random());
}, 10);

const c = new Counter({
	name: 'test_counter',
	help: 'Example of a counter',
	labelNames: ['code']
});

setInterval(() => {
	c.inc({ code: 200 });
}, 5000);

setInterval(() => {
	c.inc({ code: 400 });
}, 2000);

setInterval(() => {
	c.inc();
}, 2000);

const g = new Gauge({
	name: 'test_gauge',
	help: 'Example of a gauge',
	labelNames: ['method', 'code']
});

setInterval(() => {
	g.set({ method: 'get', code: 200 }, Math.random());
	g.set(Math.random());
	g.labels('post', '300').inc();
}, 100);

server.get('/metrics', (req, res) => {
	console.log(`The content type is ${register.contentType}`)
	res.set('Content-Type', register.contentType);
	console.log(register.metrics());
	res.send(register.metrics());
});

server.get('/metrics/counter', (req, res) => {
	res.set('Content-Type', register.contentType);
	res.send(register.getSingleMetricAsString('test_counter'));
});

//Enable collection of default metrics
client.collectDefaultMetrics();

console.log('Server listening to 9000, metrics exposed on /metrics endpoint');
server.listen(9000);
