import { VlanRecord } from "../types/vlan-record.type";

export const FORMAT_INPUT_PLACEHOLDERS: { [placeholder: string]: keyof VlanRecord } = {
    ['${vlan.name}']: 'name',
    ['${vlan.id}']: 'id'
};
