#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';

import { VlanRecord } from './types/vlan-record.type';
import { OutputFormat } from './types/output-format.type';
import { DEFAULT_FORMAT } from './consts/default-format.const';
import { FORMAT_INPUT_PLACEHOLDERS } from './consts/format-input-placeholders.const';

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

function parseFormat(format: string): OutputFormat | undefined {
    return format
        ? (record: VlanRecord) => {
            return Object.keys(FORMAT_INPUT_PLACEHOLDERS).reduce((output, key) => {
                const regex = new RegExp(escapeRegExp(key), 'g')

                return output.replace(regex, String(record[FORMAT_INPUT_PLACEHOLDERS[key]]))
             }, format.replace(/\\n/g, '\n').replace(/\\t/g, '\t'))
        }
        : undefined;
}

// Helper to safely escape regex special characters
function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatRecords(vlanRecords: VlanRecord[], format: OutputFormat = DEFAULT_FORMAT): string {
    return vlanRecords.reduce((allRecords, record) => allRecords += `${format(record)}\n`, '')
}

program
    .name('vlan-parser')
    .description('A CLI tool that parses deprecated cisco vlan records')
    .usage('<input-file> <output-file>')
    .argument('<file1>', 'Path to first file')
    .argument('<file2>', 'Output file name')
    .option('-f, --format [format]', 'Output format')
    .argument('[format]', 'The format wanted for vlan records')
    .action((file1: string, file2: string, format?: string) => {
        try {
            const filePath = path.resolve(file1);
            const outputFilePath = path.resolve(file2);

            const rows = fs.readFileSync(filePath, 'utf-8').split('\n');
            const outputFormat = parseFormat(format || '');

            const formattedRecords = outputFormat
                ? formatRecords(getVlanRecords(rows), outputFormat)
                : formatRecords(getVlanRecords(rows));

            fs.writeFileSync(outputFilePath, formattedRecords)
        } catch (err: any) {
            console.error('❌ Error reading file with path:', file1);
            process.exit(1);
        }
    });

program.parse();
