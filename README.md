# IoT-based-Home-Security-Application

#Instructions for circuit connections - 

1. Connections for Light Sensor
a. Light Sensor has 3 pins – Data Out, VCC and GND
b. VCC is connected to 5 V of Raspberry Pi
c. GND is connected to GND of Raspberry Pi
d. Out Pin from Light Sensor is connected to GPIO Pin 4
2. Connections for Ultrasonic Proximity Sensor
a. There are 4 pins – VCC, GND, Echo and Trigger
b. VCC is connected to 5 V of Raspberry Pi
c. GND is connected to GND of Raspberry Pi
d. Echo is connected to GPIO Pin 24
e. Trigger is connected to GPIO Pin 23
3. Connections for LED
a. LED is used to indicate the status of Sensors
b. Anode Pin of LED is connected to GPIO Pin 22
c. Cathode Pin of LED is connected to GND via Resistor.

#Server IP & Ports - 

MQTT Broker 54.153.111.104:1883
Kafka 54.153.69.222:9092
ElasticSearch 54.153.69.222:9200
Logstash 54.153.69.222:9300
Kibana 54.153.69.222:5601
Nodejs Web Server 54.67.98.63:8080


#Setup and execution of the code

•	Raspberry Pi

Sudo apt-get install python-default 
Sudo apt-get install paho-mqtt
Connection as mentioned above or follow connection diagram/screenshots
Run sensor.py python script

•	Server / VM
	
MQTT	
Open the mosquito.conf file and add listeners 1883, 8001 and protocol websockets.
Netstat -tulpen to check MQTT is running and listening on port 1883
mosquitto -c /etc/mosquitto/mosquitto.conf to restart mosquito service with specified config file.

Kafka	
vi ~/kafka/config/server.properties
Add delete.topic.enable = true
vi ~/kafka/bin/kafka-server-start.sh
Add export KAFKA_HEAP_OPTS="-Xmx256m -Xms256m”
Run ~/kafka/bin/kafka-server-start.sh ~/kafka/config/server.properties to start the Kafka server

MQTT and Kafka bridge	
sudo apt-get install python-pip
sudo pip install paho-mqtt
sudo pip install kaka-python
python bridge.py

ElasticSearch	
cd ~/elasticsearch/elasticsearch-2.2.1
netstat -tulpen to check whether ElasticSearch is in listening on port 9200
Go to ~/elasticsearch/elasticsearch-2.2.1 
./bin/elasticsearch to start ElasticSearch

Kibana	
cd ~/kibana/kibana-4.4.2-linux-x64
vi config/kibana.yml
Add elasticsearch.url: “http://localhost:9200" for connecting Elasticsearch to Kibana
cd ~/kibana/kibana-4.4.2-linux-x64 and Execute ./bin/kibana to start the Kibana server
Open  http:// 54.153.69.222:5801 

LogStash	
cd ~/logstash/logstash-2.2.2
Edit the Logstash.conf file to add required input , filter and output plugins to consider only low light data..	•	Run bin/logstash agent -f logstash.conf
to start the LogStash

•	Web Application
Install nodejs and npm
‘npm install’ to install all dependencies from package.json
Run ‘node webapp.js’ to start web application server.
Open ‘http://54.67.98.63:8080> to view the web application.
