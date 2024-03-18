#!/bin/bash
rm -rf ./dockprom
#mkdir dockprom
mkdir prometheus
npm install
#cd dockprom
cd prometheus
#git clone https://github.com/stefanprodan/dockprom.git .
mv ./prometheus/prometheus.yml ./prometheus/prometheus.yml.bak
cp ../config/prometheus.yml ./prometheus/
echo $1
sed -i '' "s/IP_ADDRESS/$1/g" ./prometheus/prometheus.yml
rm ../DNAC_USER_CONFIG.js
cp ../DNAC_USER_CONFIG_TPL.js ../DNAC_USER_CONFIG.js
sed -i '' "s/IP_ADDRESS/$2/g" ../DNAC_USER_CONFIG.js
sed -i '' "s/USER_NAME/$3/g" ../DNAC_USER_CONFIG.js
sed -i '' "s/USER_PASSWORD/$4/g" ../DNAC_USER_CONFIG.js
#docker-compose up -d
docker run \
    -p 9090:9090 \
    -v ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
    prom/prometheus
cd ..
node ./server.js
