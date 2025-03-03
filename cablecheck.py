import json
import RPi.GPIO as GPIO
import time

# Define GPIO pins for each Ethernet pin
gpio_pins = {
    1: 14, #2,  # Pin 1 -> GPIO 2
    2: 15, #3,  # Pin 2 -> GPIO 3
    3: 4,  # Pin 3 -> GPIO 4
    4: 17, # Pin 4 -> GPIO 17
    5: 27, # Pin 5 -> GPIO 27
    6: 22, # Pin 6 -> GPIO 22
    7: 10, # Pin 7 -> GPIO 10
    8: 9   # Pin 8 -> GPIO 9
}

# Define expected loopback connections
loopback_connections = {
    1: 2,  # Pin 1 loops back to Pin 2
    2: 1,  # Pin 2 loops back to Pin 1
    3: 6,  # Pin 3 loops back to Pin 6
    4: 5,  # Pin 4 loops back to Pin 5
    5: 4,  # Pin 5 loops back to Pin 4
    6: 3,  # Pin 6 loops back to Pin 3
    7: 8,  # Pin 7 loops back to Pin 8
    8: 7   # Pin 8 loops back to Pin 7
}

def setup_gpio():
    GPIO.setmode(GPIO.BCM)
    for pin in gpio_pins.values():
        GPIO.setup(pin, GPIO.OUT)
        GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)  # Set pins as inputs too

def check_wiring():
    print("check_wiring")
    wiring = {}
    for send_pin in loopback_connections:
        recv_pin = loopback_connections[send_pin]
        #print(f"Send Pin {send_pin} to Recv Pin {recv_pin}")
        GPIO.setup(gpio_pins[send_pin], GPIO.OUT)
        GPIO.output(gpio_pins[send_pin], GPIO.HIGH)
        time.sleep(0.1)
        if GPIO.input(gpio_pins[recv_pin]) == GPIO.HIGH:
            wiring[send_pin] = recv_pin
        GPIO.output(gpio_pins[send_pin], GPIO.LOW)
    return wiring

# for json geeks for geeks.org
def encoder(obj)
    if isinstance(obj, set)
        return list(obj)
    return obj
def main():
    #print("main")
    setup_gpio()
    try:
        wiring = check_wiring()
        if wiring == loopback_connections:
            print("Pass - Wired correctly")
        else:
            print("Fail - Wired incorrectly")
        # Print wiring
        for send_pin, recv_pin in wiring.items():
            print(f"pin {send_pin} to pin {recv_pin}")
    finally:
        GPIO.cleanup()

if __name__ == "__main__":
    main()
