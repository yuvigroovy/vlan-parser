import { VlanRecord } from "../types/vlan-record.type";
import { OutputFormat } from "../types/output-format.type";

export const DEFAULT_FORMAT: OutputFormat = (record: VlanRecord) => `vlan ${record.id}\nname ${record.name}`;
