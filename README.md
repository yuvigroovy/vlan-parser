# vlan-parser

A simple tool to parse old formatted Cisco vlans to the newer format used in modern switches.

## Installation
Run the command ```npm i -g vlan-parser```.

## Usage
Connect to your Cisco switch, run ```sh vlan``` and export it to a text file.<br>
Then use it like so: ```vlan-parser <sh-vlan-file> <output-file-name>```

#### Control Output Format
In order to customize the output format there is the ```--format``` option.
Enter a string that defines the wanted format with ```${}``` to specify the vlan values.
Available vlan options are ```${vlan.id}``` and ```${vlan.name}```.

#### Example
```vlan-parser old-vlans.txt new-vlans.txt```
With custom formatting: ```vlan-parser show-vlan.txt out.txt --format 'vlan ${vlan.id}\nname ${vlan.name}'```