//% color=#0f9d58 icon="\uf1eb" block="Pico Modem"
namespace picoModem {
    //% block="hello modem"
    export function hello() {
        serial.writeLine("AT?")
    }
}
