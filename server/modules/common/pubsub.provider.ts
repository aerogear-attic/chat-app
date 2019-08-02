import { PubSub } from "apollo-server-express";
import mqtt, { IClientOptions } from "mqtt";
import { MQTTPubSub } from "@aerogear/graphql-mqtt-subscriptions";

const mqttHost = process.env.MQTT_HOST || "localhost";

console.log("Using MQTT PubSub");
const mqttOptions = {
  host: mqttHost,
  servername: mqttHost, // needed to work in OpenShift. Lookup SNI.
  username: process.env.MQTT_USERNAME || "localhost",
  password: process.env.MQTT_PASSWORD || "localhost",
  port: process.env.MQTT_PORT || 1883,
  protocol: process.env.MQTT_PROTOCOL || "mqtt",
  rejectUnauthorized: false
};

const client = mqtt.connect(mqttHost, mqttOptions as IClientOptions) as any;

console.log(`attempting to connect to messaging service ${mqttHost}`);

client.on("connect", () => {
  console.log("connected to messaging service");
});

const pubsub = new MQTTPubSub({ client });

export { pubsub };
export { PubSub } from "apollo-server-express";
