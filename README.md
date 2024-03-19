# Cisco Catalyst Center Prometheus Exporter

This repository was forked from https://github.com/CiscoDevNet/DNACPrometheusExporter and is reference source code for a Prometheus Data Exporter for DNAC. The purpose of this fork is to be able to separate the functions of the downloaded Docker container (https://github.com/stefanprodan/dockprom) into separate containers and to update the JavaScript files to adopt ES6.

Cisco DNA Center was rebranded as Cisco Catalyst Center in 2023 and as such, the documentation in this repository will be updated accordingly.

## Pre-requisites
1. Node version v8.11.2 or beyond recommended.  (Tested with node v 8.11.2)
2. Docker 18.09.2 or beyond recommended. (Tested with docker 18.0.9.2).  docker-compose should be available.
3. Bash shell for helper scripts
4. Cisco Catalyst Center version 1.2.6 and above

## Configuration & Run
./init.sh <Local Machine IP Address> <DNAC IP Address> <DNAC admin user> <DNAC admin password>
All parameters are mandatory!
1. <Local Machine IP Address> - The IP address of your local machine that the web server and containers will bind to
2. <DNAC IP Address> - Enterprise port/VIP of your Cisco Catalyst Center appliance
3. <DNAC admin user> - The username with API access to the Cisco Catalyst Center appliance
4. <DNAC admin password> - The password for the specified username

**Example**
./init.sh 1.2.3.1 9.8.7.6 admin admin_password

## Usage
Browse http://localhost:9000/metrics whether metrics are seen
Browse http://localhost:9090 and check whether metrics with dnac_ are exported.
If the metrics are present, execute queries and examine results and graphs.  

## Troubleshoot
Console logs should indicate if there are issues in starting up docker or node.
For checking prometheus and scraper connectivity check browser http://localhost:9090 -> Status -> Targets.

----

## Licensing info
BSD 3 license

----

## Credits and references

1. https://github.com/stefanprodan/dockprom
2. https://prometheus.io/
3. https://www.cisco.com/c/en/us/products/cloud-systems-management/dna-center/index.html
4. https://developer.cisco.com/docs/dna-center/
5. https://learningnetwork.cisco.com/s/question/0D56e0000D2IZ9dCQG/catalyst-center-to-replace-dna-center-cisco-showcases-vision-to-simplify-networking-and-securely-connect-the-world-innovation-continues
