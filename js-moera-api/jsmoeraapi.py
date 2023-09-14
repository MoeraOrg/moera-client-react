from __future__ import annotations

import sys
from os.path import normpath
from typing import Any, TextIO

import yaml


def read_api(ifname: str) -> Any:
    with open(ifname, 'r') as ifile:
        return yaml.safe_load(ifile)


def generate_enum(enum: Any, tfile: TextIO) -> None:
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
                tfile.write(s)
                s = '   '
            s += c
    s += ';\n'
    tfile.write(s)


def schema_type(sfile: TextIO, indent: int, a_type: str, struct: bool = False, nullable: bool = False,
                default: Any = None, min: float | None = None, max: float | None = None) -> None:
    if struct and not nullable:
        sfile.write(a_type + 'Type')
        return
    sfile.write('{\n')
    if struct:
        sfile.write((indent + 1) * 4 * ' ' + f'...{a_type}Type')
    else:
        sfile.write((indent + 1) * 4 * ' ' + f'type: "{a_type}"')
    if nullable:
        sfile.write(',\n')
        sfile.write((indent + 1) * 4 * ' ' + 'nullable: true')
    if default is not None:
        sfile.write(',\n')
        sfile.write((indent + 1) * 4 * ' ' + f'default: {default}')
    if min is not None:
        sfile.write(',\n')
        sfile.write((indent + 1) * 4 * ' ' + f'minimum: {min}')
    if max is not None:
        sfile.write(',\n')
        sfile.write((indent + 1) * 4 * ' ' + f'maximum: {max}')
    sfile.write('\n')
    sfile.write(indent * 4 * ' ' + '}')


def schema_array(sfile: TextIO, indent: int, a_type: str, struct: bool = False, nullable: bool = False,
                 default: Any = None, min_items: int | None = None, max_items: int | None = None,
                 min: float | None = None, max: float | None = None) -> None:
    sfile.write('{\n')
    sfile.write((indent + 1) * 4 * ' ' + 'type: "array",\n')
    sfile.write((indent + 1) * 4 * ' ' + 'items: ')
    schema_type(sfile, indent + 1, a_type, struct=struct, nullable=False, min=min, max=max)
    if nullable:
        sfile.write(',\n')
        sfile.write((indent + 1) * 4 * ' ' + 'nullable: true')
    if default is not None:
        sfile.write(',\n')
        sfile.write((indent + 1) * 4 * ' ' + f'default: {default}')
    if min_items is not None:
        sfile.write(',\n')
        sfile.write((indent + 1) * 4 * ' ' + f'minItems: {min_items}')
    if max_items is not None:
        sfile.write(',\n')
        sfile.write((indent + 1) * 4 * ' ' + f'maxItems: {max_items}')
    sfile.write('\n')
    sfile.write(indent * 4 * ' ' + '}')


def schema_map_string_int(sfile: TextIO, indent: int, nullable: bool = False) -> None:
    sfile.write('{\n')
    sfile.write((indent + 1) * 4 * ' ' + 'type: "object",\n')
    sfile.write((indent + 1) * 4 * ' ' + 'patternProperties: {\n')
    sfile.write((indent + 2) * 4 * ' ' + '"^.*$": ')
    schema_type(sfile, indent + 2, 'integer')
    sfile.write('\n')
    sfile.write((indent + 1) * 4 * ' ' + '}')
    if nullable:
        sfile.write(',\n')
        sfile.write((indent + 1) * 4 * ' ' + 'nullable: true')
    sfile.write('\n')
    sfile.write(indent * 4 * ' ' + '}')


def generate_operations(operations: Any, tfile: TextIO, sfile: TextIO) -> None:
    tfile.write('\n')
    tfile.write('export interface %s {\n' % operations['name'])
    for field in operations['fields']:
        tfile.write('    %s?: PrincipalValue | null;\n' % field['name'])
    tfile.write('}\n')

    sfile.write('\n')
    sfile.write('const {name}Type: JSONSchemaType<API.{name}> = {{\n'.format(name=operations['name']))
    sfile.write('    type: "object",\n')
    sfile.write('    properties: {\n')
    for field in operations['fields']:
        sfile.write('        "%s": ' % field['name'])
        schema_type(sfile, 2, "string", nullable=True)
        sfile.write(',\n')
    sfile.write('    },\n')
    sfile.write('    additionalProperties: false\n')
    sfile.write('};\n')


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

SCHEMA_TYPES = {
    'String': ('string', False),
    'String[]': ('string', True),
    'int': ('integer', False),
    'float': ('number', False),
    'boolean': ('boolean', False),
    'timestamp': ('integer', False),
    'byte[]': ('string', False),
    'UUID': ('string', False),
    'String -> int': schema_map_string_int
}


class Structure:
    data: Any
    generated: bool = False
    depends: list[str]
    uses_body: bool = False
    output: bool = False
    output_array: bool = False

    def __init__(self, data: Any) -> None:
        self.data = data
        self.depends = [field['struct'] for field in data['fields'] if 'struct' in field]

    @property
    def generic(self) -> bool:
        return self.uses_body and self.output

    def generate_class(self, tfile: TextIO, structs: dict[str, Structure]) -> None:
        if self.generic:
            tfile.write('\nexport interface %sBase<B> {\n' % self.data['name'])
        else:
            tfile.write('\nexport interface %s {\n' % self.data['name'])
        for field in self.data['fields']:
            if field.get('optional', False) and 'js-default' not in field:
                tmpl = '    %s?: %s | null;\n'
            else:
                tmpl = '    %s: %s;\n'
            if 'struct' in field:
                if field['struct'] == 'Body':
                    t = 'B' if self.generic else 'string'
                else:
                    t = field['struct']
                    if self.generic and field['struct'] in structs and structs[field['struct']].generic:
                        t += 'Base<B>'
            elif 'enum' in field:
                t = field['enum']
            else:
                if field['type'] == 'any':
                    continue
                ft = JS_TYPES.get(field['type'])
                if ft is None:
                    print('Unrecognized field type: ' + field['type'])
                    exit(1)
                t = ft
            if field.get('array', False):
                t += '[]'
            tfile.write(tmpl % (field['name'], t))
        tfile.write('}\n')
        if self.generic:
            tfile.write('\nexport type Encoded{name} = {name}Base<string>;\n'.format(name=self.data['name']))
            tfile.write('export type {name} = {name}Base<Body>;\n'.format(name=self.data['name']))

    def generate_schema(self, sfile: TextIO) -> None:
        if self.uses_body:
            sfile.write('\nexport const {name}Type: JSONSchemaType<API.Encoded{name}> = {{\n'
                        .format(name=self.data['name']))
        else:
            sfile.write('\nexport const {name}Type: JSONSchemaType<API.{name}> = {{\n'
                        .format(name=self.data['name']))
        sfile.write('    type: "object",\n')
        sfile.write('    properties: {\n')
        required: list[str] = []
        for field in self.data['fields']:
            if field.get('type') == 'any':
                continue

            sfile.write('        "%s": ' % field['name'])
            default = field.get('js-default')
            optional = field.get('optional', False) and default is None
            array = field.get('array', False)
            if not optional:
                required.append(field['name'])
            struct = False
            if 'struct' in field:
                if field['struct'] == 'Body':
                    t = 'string'
                else:
                    t = field['struct']
                    struct = True
            elif 'enum' in field:
                t = 'string'
            else:
                s_type = SCHEMA_TYPES.get(field['type'])
                if callable(s_type):
                    t = None
                    s_type(sfile, 2, nullable=optional)
                else:
                    assert isinstance(s_type, tuple)
                    t, array = s_type
            if t is not None:
                if array:
                    schema_array(sfile, 2, t, struct=struct, nullable=optional, default=default,
                                 min_items=field.get('min-items'), max_items=field.get('max-items'),
                                 min=field.get('min'), max=field.get('max'))
                else:
                    schema_type(sfile, 2, t, struct=struct, nullable=optional, default=default,
                                min=field.get('min'), max=field.get('max'))
            sfile.write(',\n')
        sfile.write('    },\n')
        if len(required) > 0:
            sfile.write('    required: [\n')
            for name in required:
                sfile.write(f'        "{name}",\n')
            sfile.write('    ],\n')
        sfile.write('    additionalProperties: false\n')
        sfile.write('};\n')
        sfile.write('\nexport const {name} = schema({name}Type);\n'.format(name=self.data['name']))

        if self.output_array:
            sfile.write('\nexport const %sArray = schema(' % self.data['name'])
            schema_array(sfile, 0, self.data['name'], struct=True)
            if self.uses_body:
                tmpl = ' as JSONSchemaType<API.Encoded%s[]>);\n'
            else:
                tmpl = ' as JSONSchemaType<API.%s[]>);\n'
            sfile.write(tmpl % self.data['name'])

    def generate(self, tfile: TextIO, sfile: TextIO, structs: dict[str, Structure]) -> None:
        self.generate_class(tfile, structs)
        if self.output:
            self.generate_schema(sfile)
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


def scan_output_usage(api: Any, structs: dict[str, Structure]) -> None:
    for obj in api['objects']:
        for request in obj.get('requests', []):
            if 'out' not in request:
                continue
            if 'struct' not in request['out']:
                continue
            struct = request['out']['struct']
            if struct not in structs:
                continue
            structs[struct].output = True
            structs[struct].output_array |= request['out'].get('array', False)

    modified = True
    while modified:
        modified = False
        for struct in structs.values():
            if not struct.output:
                continue
            for dep in struct.depends:
                if dep in structs and not structs[dep].output:
                    structs[dep].output = True
                    modified = True


def generate_structures(api: Any, tfile: TextIO, sfile: TextIO) -> None:
    structs: dict[str, Structure] = {struct['name']: Structure(struct) for struct in api['structures']}
    scan_body_usage(structs)
    scan_output_usage(api, structs)

    gen = True
    while gen:
        gen = False
        for struct in structs.values():
            if struct.generated:
                continue
            if any(not structs[d].generated for d in struct.depends if d in structs):
                continue
            struct.generate(tfile, sfile, structs)
            gen = True
    loop = [s.data['name'] for s in structs.values() if not s.generated]
    if len(loop) > 0:
        print('Dependence loop in structures: ' + ', '.join(loop))
        exit(1)


PREAMBLE_TYPES = '''// This file is generated

export type PrincipalValue = "none" | "private" | "admin" | "owner" | "secret" | "senior" | "enigma" | "major"
    | "signed" | "subscribed" | "public" | "unset" | string;
'''

PREAMBLE_SCHEMAS = '''// This file is generated

import { JSONSchemaType } from 'ajv';

import schema from "api/schema";
import * as API from "api/node/api-types";
'''


def generate_types(api: Any, tfname: str, sfname: str) -> None:
    with open(tfname, 'w+') as tfile:
        with open(sfname, 'w+') as sfile:
            tfile.write(PREAMBLE_TYPES)
            sfile.write(PREAMBLE_SCHEMAS)
            for enum in api['enums']:
                generate_enum(enum, tfile)
            for operations in api['operations']:
                generate_operations(operations, tfile, sfile)
            generate_structures(api, tfile, sfile)


if len(sys.argv) < 2 or sys.argv[1] == '':
    print("Usage: js-moera-api <node_api.yml file path> <output directory>")
    exit(1)

api = read_api(sys.argv[1])
outdir = sys.argv[2] if len(sys.argv) >= 3 else '.'
generate_types(api, normpath(outdir + '/api-types.ts'), normpath(outdir + '/api.ts'))
