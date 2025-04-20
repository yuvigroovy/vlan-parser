# vlan-parser

A simple tool to parse old formatted Cisco vlans to the newer format used in modern switches.

### Installation
Run the command ```npm i -g vlan-parser```.

### Usage
Connect to your Cisco switch, run ```sh vlan``` and export it to a text file.<br>
Then use it like so: ```vlan-parser <sh-vlan-file> <output-file-name>```

### Example
```vlan-parser old-vlans.txt new-vlans.txt```
