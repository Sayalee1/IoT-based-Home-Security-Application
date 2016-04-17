import paho.mqtt.client as mqtt
import os

configfile = '/home/pi/Sayalee/config_settings.config'



def replace_line(file_name, line_num, text):
    lines = open(file_name, 'r').readlines()
    lines[line_num] = text
    out = open(file_name, 'w')
    out.writelines(lines)
    out.close()


# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("SetThreshold")
    client.subscribe("SetSensorState")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    
    if msg.topic == "SetThreshold":
        tempThreshold = 'Threshold = ' + str(int(msg.payload)*100) + '\n'
        mode = 'a' if os.path.exists(configfile) else 'w'
        with open(configfile, mode) as f:
            replace_line(configfile, 0, tempThreshold)
            
    if msg.topic == "SetSensorState":
        tempSensorState = 'SensorState = ' + str(msg.payload) + '\n'      
        mode = 'a' if os.path.exists(configfile) else 'w'
        with open(configfile, mode) as f:
            replace_line(configfile, 1, tempSensorState)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("54.153.111.104", 1883, 60)


# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()
