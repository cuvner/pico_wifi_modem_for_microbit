//% color=#0f9d58 icon="\uf1eb" block="Pico Modem"
namespace picoModem {
    let _onMsg: (topic: string, payload: string) => void = null
    let _feeds: string[] = []

    function at(line: string) {
        serial.writeLine(line)
        basic.pause(50)
    }

    //% block="init modem TX %tx RX %rx at %baud"
    //% tx.defl=SerialPin.P0 rx.defl=SerialPin.P1 baud.defl=BaudRate.BaudRate115200
    export function init(tx: SerialPin, rx: SerialPin, baud: BaudRate) {
        serial.redirect(tx, rx, baud)
        basic.pause(100)
        at("AT?")
    }

    //% block="set Wi-Fi SSID %ssid password %password"
    export function wifi(ssid: string, password: string) {
        at(`AT+WIFI="${ssid}","${password}"`)
    }

    //% block="use Adafruit IO user %user key %key"
    export function aio(user: string, key: string) {
        at(`AT+AIO="${user}","${key}"`)
    }

    //% block="set MQTT broker %broker user %user pass %pass port %port SSL %ssl"
    //% ssl.defl=false port.defl=1883
    export function mqtt(broker: string, user: string, pass: string, port: number, ssl: boolean) {
        at(`AT+MQTT="${broker}","${user}","${pass}",${port},${ssl ? 1 : 0}`)
    }

    //% block="clear feed list"
    export function clearFeeds() {
        _feeds = []
    }

    //% block="add feed %name"
    export function addFeed(name: string) {
        _feeds.push(name)
    }

    //% block="send feed list to modem"
    export function sendFeeds() {
        if (_feeds.length == 0) return
        const q = _feeds.map(f => `"${f}"`).join(",")
        at(`AT+FEEDS=${q}`)
    }

    //% block="connect modem"
    export function connect() {
        at("AT+CONNECT")
    }

    //% block="save config in modem"
    export function save() {
        at("AT+SAVE")
    }

    //% block="use CSV mode"
    export function modeCSV() { at("AT+MODE=CSV") }

    //% block="use RAW mode"
    export function modeRAW() { at("AT+MODE=RAW") }

    //% block="send CSV line %csv"
    export function sendCSV(csv: string) {
        serial.writeLine(csv)
    }

    //% block="send up to 6 numbers %v1 %v2 %v3 %v4 %v5 %v6"
    //% v2.defl=0 v3.defl=0 v4.defl=0 v5.defl=0 v6.defl=0
    export function sendNumbers(v1?: number, v2?: number, v3?: number, v4?: number, v5?: number, v6?: number) {
        const arr = [v1, v2, v3, v4, v5, v6]
            .filter((v) => v !== undefined)
            .map(v => `${v}`)
        serial.writeLine(arr.join(","))
    }

    //% block="publish topic %topic payload %payload"
    export function publish(topic: string, payload: string) {
        at(`AT+PUB="${topic}","${payload}"`)
    }

    //% block="subscribe topic %topic"
    export function subscribe(topic: string) {
        at(`AT+SUB="${topic}"`)
    }

    //% block="on MQTT message do"
    export function onMessage(handler: (topic: string, payload: string) => void) {
        _onMsg = handler
    }

    serial.onDataReceived(Delimiters.NewLine, function () {
        const s = serial.readLine().trim()
        // Modem echoes messages as: RXMQTT:<topic>:<payload>
        if (s.startsWith("RXMQTT:")) {
            const first = s.indexOf(":", 7)
            if (first > 0) {
                const topic = s.substr(7, first - 7)
                const payload = s.substr(first + 1)
                if (_onMsg) _onMsg(topic, payload)
            }
        }
        // You can also watch for "OK:..." / "ERR:..." if you want.
    })
}
