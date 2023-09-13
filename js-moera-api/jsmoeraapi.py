from __future__ import annotations

import sys
from os.path import normpath
from typing import Any, TextIO

import yaml


def read_api(ifname: str) -> Any:
    with open(ifname, 'r') as ifile:
        return yaml.safe_load(ifile)


def generate_enum(enum: Any, ofile: TextIO) -> None:
    s = '\nexport type %s = ' % enum['name']
    first = True
    for item in enum['values']:
        c = '"%s"' % item['name']
        if first:
            s += c
            first = False
        else:
            c = ' | ' + c
            if len(s) + len(c) > 120:
                s += '\n'
                ofile.write(s)
                s = '   '
            s += c
    s += ';\n'
    ofile.write(s)


def generate_operations(operations: Any, ofile: TextIO) -> None:
    ofile.write('\n')
    ofile.write('export interface %s {\n' % operations['name'])
    for field in operations['fields']:
        ofile.write('    %s?: PrincipalValue | null;\n' % field['name'])
    ofile.write('}\n')


JS_TYPES = {
    'String': 'string',
    'String[]': 'string[]',
    'int': 'number',
    'float': 'number',
    'boolean': 'boolean',
    'timestamp': 'number',
    'byte[]': 'string',
    'UUID': 'string',
    'String -> int': 'Partial<Record<string, number>>'
}


class Structure:
    data: Any
    generated: bool = False
    depends: list[str]
    uses_body: bool = False

    def __init__(self, data: Any) -> None:
        self.data = data
        self.depends = [field['struct'] for field in data['fields'] if 'struct' in field]

    def generate(self, ofile: TextIO, structs: dict[str, Structure]) -> None:
        if self.uses_body:
            ofile.write('\nexport interface %sBase<B> {\n' % self.data['name'])
        else:
            ofile.write('\nexport interface %s {\n' % self.data['name'])
        for field in self.data['fields']:
            if field.get('optional', False):
                tmpl = '    %s?: %s | null;\n'
            else:
                tmpl = '    %s: %s;\n'
            if 'struct' in field:
                if field['struct'] == 'Body':
                    t = 'B'
                else:
                    t = field['struct']
                    if field['struct'] in structs and structs[field['struct']].uses_body:
                        t += 'Base<B>'
            elif 'enum' in field:
                t = field['enum']
            else:
                if field['type'] == 'any':
                    continue
                t = JS_TYPES.get(field['type'])
                if t is None:
                    print('Unrecognized field type: ' + field['type'])
                    exit(1)
            if field.get('array', False):
                t += '[]'
            ofile.write(tmpl % (field['name'], t))
        ofile.write('}\n')
        if self.uses_body:
            ofile.write('\nexport type Encoded{name} = {name}Base<string>;\n'.format(name=self.data['name']))
            ofile.write('export type {name} = {name}Base<Body>;\n'.format(name=self.data['name']))
        self.generated = True


def scan_body_usage(structs: dict[str, Structure]) -> None:
    for struct in structs.values():
        if 'Body' in struct.depends:
            struct.uses_body = True

    modified = True
    while modified:
        modified = False
        for struct in structs.values():
            if struct.uses_body:
                continue
            for dep in struct.depends:
                if dep in structs and structs[dep].uses_body:
                    struct.uses_body = True
                    modified = True


def generate_structures(api: Any, ofile: TextIO) -> None:
    structs: dict[str, Structure] = {struct['name']: Structure(struct) for struct in api['structures']}
    scan_body_usage(structs)

    gen = True
    while gen:
        gen = False
        for struct in structs.values():
            if struct.generated:
                continue
            if any(not structs[d].generated for d in struct.depends if d in structs):
                continue
            struct.generate(ofile, structs)
            gen = True
    loop = [s.data['name'] for s in structs.values() if not s.generated]
    if len(loop) > 0:
        print('Dependence loop in structures: ' + ', '.join(loop))
        exit(1)


PREAMBLE = '''// This file is generated

export type PrincipalValue = "none" | "private" | "admin" | "owner" | "secret" | "senior" | "enigma" | "major"
    | "signed" | "subscribed" | "public" | "unset" | string;
'''


def generate_types(api: Any, ofname: str) -> None:
    with open(ofname, 'w+') as ofile:
        ofile.write(PREAMBLE)
        for enum in api['enums']:
            generate_enum(enum, ofile)
        for operations in api['operations']:
            generate_operations(operations, ofile)
        generate_structures(api, ofile)


if len(sys.argv) < 2 or sys.argv[1] == '':
    print("Usage: js-moera-api <node_api.yml file path> <output directory>")
    exit(1)

api = read_api(sys.argv[1])
outdir = sys.argv[2] if len(sys.argv) >= 3 else '.'
generate_types(api, normpath(outdir + '/api-types.ts'))
