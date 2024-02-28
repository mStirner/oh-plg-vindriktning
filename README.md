# Introduction
Integrates the [ESPHome modified](https://github.com/Hypfer/esp8266-vindriktning-particle-sensor) [IKEA VINDRIKTNING](https://www.ikea.com/de/de/p/vindriktning-luftqualitaetssensor-70498242/) sensor into OpenHaus

# Installation
1) Create a new plugin over the OpenHaus backend HTTP API
2) Mount the plugin source code folder into the backend
3) run `npm install`

# Development
Add plugin item via HTTP API:<br />
[PUT] `http://{{HOST}}:{{PORT}}/api/plugins/`
```json
{
   "name":"ESPHome/IKEA Vindriktning Integration ",
   "version":1,
   "intents":[
      "devices",
      "endpoints",
      "mqtt"
   ],
   "uuid": "a0b38ba9-fff8-4878-ac58-69aaa66bcc88"
}

```
Mount the source code into the backend plugins folder
```sh
sudo mount --bind ~/projects/OpenHaus/plugins/oh-plg-vindriktning/ ~/projects/OpenHaus/backend/plugins/a0b38ba9-fff8-4878-ac58-69aaa66bcc88/
```

# Links
- https://github.com/Hypfer/esp8266-vindriktning-particle-sensor
- https://www.ikea.com/de/de/p/vindriktning-luftqualitaetssensor-70498242/