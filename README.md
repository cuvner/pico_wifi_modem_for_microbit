# Pico Modem (micro:bit → Pico W)

Blocks to use a Raspberry Pi Pico W (CircuitPython) as a Wi-Fi/MQTT modem from a BBC micro:bit.

## Wiring
- micro:bit P0 (TX) → Pico W GP1 (UART0 RX)
- (optional) micro:bit P1 (RX) ← Pico W GP0 (UART0 TX)
- GND ↔ GND
- Baud: 115200

## Quick start (Adafruit IO, CSV mode)
1) `Pico Modem → init modem TX P0 RX P1 at 115200`
2) `set Wi-Fi SSID "MyWiFi" password "MyPass"`
3) `use Adafruit IO user "myuser" key "aio_xxx"`
4) `clear feed list` + `add feed "mb-temp"` + `add feed "mb-light"` → `send feed list to modem`
5) `use CSV mode` → `connect modem`
6) In `forever`: `send up to 6 numbers temperature() lightLevel()`

Or publish raw topics: `publish "my/topic" "hello"` (use RAW mode if streaming arbitrary).

## Receiving messages
Use `on MQTT message do` to handle messages the modem subscribed to with `subscribe topic`.
