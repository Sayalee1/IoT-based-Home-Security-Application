import RPi.GPIO as GPIO, time, os
import paho.mqtt.client as mqtt
GPIO.setmode(GPIO.BCM)

configfile = '/home/pi/Sayalee/config_settings.config'

TRIG = 23
ECHO = 24
LIGHT = 4
LED = 22
sensorstate = 'true'
threshold = '100'

def on_connect(client, userdata, rc):
    print("Connected with result code "+str(rc))  

client = mqtt.Client()
client.on_connect = on_connect

client.connect(host="54.153.111.104", port=1883, keepalive=60, bind_address="")


print "Distance Measurement is Going On"

GPIO.setup(TRIG,GPIO.OUT)
GPIO.setup(ECHO,GPIO.IN)
GPIO.setup(LED,GPIO.OUT)
GPIO.output(TRIG, True)


while True:
    
    conf = open(configfile, 'r')
    ln = conf.readlines()
    thrstemp = ln[0].split("=")
    sensorstatestring = ln[1].split("=")
    threshold = str(thrstemp[1].strip())
    sensorstate = str(sensorstatestring[1].strip())
    print 'threshold : ' + str(threshold)
    print 'sensorstate : ' + str(sensorstate)        
    if sensorstate == 'true':
        reading = 0
        GPIO.output(LED,GPIO.HIGH)
        GPIO.setup(LIGHT, GPIO.OUT)
        GPIO.output(LIGHT, GPIO.LOW)
        time.sleep(0.1)
        GPIO.setup(LIGHT, GPIO.IN)
    
        while (GPIO.input(LIGHT) == GPIO.LOW):
            reading += 1
    
        GPIO.output(TRIG, False)
        print "Waiting For Sensor To Settle"
        time.sleep(1)
        GPIO.output(TRIG, True)
        time.sleep(0.00001)
        GPIO.output(TRIG, False)
    
        while GPIO.input(ECHO)==0:
            pulseStart = time.time()
    
        while GPIO.input(ECHO)==1:
            pulseEnd = time.time()
    
        pulseDuration = pulseEnd - pulseStart
    
        distance = pulseDuration * 17150
    
        distance = round(distance, 2)
        light_value = reading
    
        print "Distance:",distance,"cm"
        print "Light:" ,light_value      
            
        
        sensorMsg = '{"Distance": ' + str(distance) + ', "Light": ' + str(light_value) + '}'
        
        notificationMsg = '{"msg": "Distance from the object is  ' + str(distance) + ' cm. Current threshold : ' + threshold + ' cm"}'
        client.publish("sensorData", sensorMsg)

        
        if int(distance) < int(threshold):
            client.publish("Notification", notificationMsg)
    else:
        GPIO.output(LED,GPIO.LOW)
            
    sensorState = '{"SensorState": '+ sensorstate + ', "ThresholdVal": ' + threshold + '}'
    client.publish("State", sensorState)
    conf.close()