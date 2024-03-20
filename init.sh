#!/bin/bash
rm -rf ./dockprom
mkdir dockprom
npm install
npm audit

cd dockprom
git clone https://github.com/stefanprodan/dockprom.git .
mv ./prometheus/prometheus.yml ./prometheus/prometheus.yml.bak
cp ../config/prometheus.yml ./prometheus/prometheus.yml
echo "IP address to bind application to is "$1
sed -i "s/IP_ADDRESS/$1/g" ./prometheus/prometheus.yml
rm ../DNAC_USER_CONFIG.js
cp ../DNAC_USER_CONFIG_TPL.js ../DNAC_USER_CONFIG.js
echo "IP address of Catalyst Center appliance is "$2
sed -i "s/IP_ADDRESS/$2/g" ../DNAC_USER_CONFIG.js
echo "Username to use for login is "$3
sed -i "s/USER_NAME/$3/g" ../DNAC_USER_CONFIG.js
sed -i "s/USER_PASSWORD/$4/g" ../DNAC_USER_CONFIG.js
docker-compose up -d

cd ..
node ./server.js
