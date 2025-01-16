module.exports = (info, logger, init) => {
    return init([
        "devices",
        "endpoints",
        "mqtt"
    ], async (scope, [
        C_DEVICES,
        C_ENDPOINTS,
        C_MQTT
    ]) => {


        // add/find devic
        const device = await new Promise((resolve) => {
            C_DEVICES.found({
                labels: [
                    "particlesensor=true",
                    "board=eps8266",
                    "esphome=true"
                ]
            }, (device) => {


                // feedback
                logger.debug("Particlesensor found", device);

                resolve(device);

            }, async (filter) => {

                // feedback
                logger.debug("Particlesensor not found, add one");

                await C_DEVICES.add({
                    name: "Particlesensor",
                    icon: "fa-solid fa-gauge-high",
                    ...filter
                });

            });
        });


        // add/find endpoint
        const endpoint = await new Promise((resolve) => {
            C_ENDPOINTS.found({
                labels: [
                    "particlesensor=true",
                    "board=eps8266",
                    "esphome=true"
                ]
            }, (endpoint) => {

                // feedback
                logger.debug("Endpoint found", endpoint);

                resolve(endpoint);

            }, (filter) => {

                // feedbac
                logger.debug("Endpoint not found, add one");

                C_ENDPOINTS.add({
                    name: "Particlesensor",
                    device: device._id,
                    icon: "fa-solid fa-gauge-high",
                    states: [{
                        name: "Particles (µg/m³)",
                        alias: "particles",
                        type: "number",
                        min: 0,
                        max: 25000
                    }],
                    ...filter
                });

            });
        });


        // add/find mqtt item
        const mqtt = await new Promise((resolve) => {
            C_MQTT.found({
                labels: endpoint.labels
            }, (topic) => {

                // feedback
                logger.debug("MQTT topic found", topic);

                resolve(topic);

            }, (filter) => {

                logger.debug("MQTT topic not found, add one");

                C_MQTT.add({
                    topic: "air-sensor/sensor/particulate_matter_25m_concentration/state",
                    description: "ESP8266/ESPHome IKEA VINDSTYRKA Particle sensor",
                    ...filter
                });

            });
        });


        // wait for device/endpoint setup
        Promise.all([device, endpoint, mqtt]).then(() => {

            // feebdack
            logger.info(`Device handling setup, waiting for changes on mqtt topic "${mqtt.topic}"`);

            mqtt.subscribe((value) => {

                logger.verbose(`mqtt topic: ${mqtt.topic} = ${value}`);
                endpoint.states[0].value = Number(value);

            });

        }).catch((err) => {

            logger.error(err, "Could not setup device/endoint handling");

        });


    });
};