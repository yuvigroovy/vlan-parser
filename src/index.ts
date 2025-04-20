#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';

import { VlanRecord } from './vlan-record.type';

const program = new Command();

function getVlanRecords(fileRows: string[]): VlanRecord[] {
    return fileRows.reduce((vlanRecords: VlanRecord[], currentRow: string) => {
        if (currentRow.charAt(0) && Number(currentRow.charAt(0))) {
            const tokens = currentRow.split(/\s+/);

            return [
                ...vlanRecords,
                {
                    id: Number(tokens[0]),
                    name: tokens[1],
                } as VlanRecord
            ];
        }

        return vlanRecords;
    }, []);
}

function getFormattedRows(vlanRecords: VlanRecord[]): string {
    const vlanStrings = vlanRecords.map((vlanRecord) => `vlan ${vlanRecord.id}\nname ${vlanRecord.name}`)

    return vlanStrings.join('\n')
}

program
    .name('vlan-parser')
    .description('A CLI tool that parses two input files')
    .usage('<file1> <file2>')
    .argument('<file1>', 'Path to first file')
    .argument('<file2>', 'Output file')
    .action((file1: string, file2: string) => {
        try {
            const filePath = path.resolve(file1);
            const outputFilePath = path.resolve(file2);

            const rawFileContent = fs.readFileSync(filePath, 'utf-8');
            const rows = rawFileContent.split('\n');
            const vlanRecords = getVlanRecords(rows);
            const formattedRecords = getFormattedRows(vlanRecords);

            fs.writeFileSync(outputFilePath, formattedRecords)
            
        } catch (err: any) {
            console.error('❌ Error reading files:', err.message);
            process.exit(1);
        }
    });

program.parse();
