from __future__ import annotations

import re
import sys
from enum import Enum
from typing import Any, TextIO

import yaml
from camel_converter import to_pascal


def ind(n: int) -> str:
    return n * 4 * ' '


def read_api(ifname: str) -> Any:
    with open(ifname, 'r') as ifile:
        return yaml.safe_load(ifile)


def generate_enum(enum: Any, tfile: TextIO) -> None:
    s = f'\nexport type {enum["name"]} = '
    first = True
    for item in enum['values']:
        c = f'"{item["name"]}"'
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
    sfile.write('{\n')
    if struct:
        if nullable:
            sfile.write(ind(indent + 1) + 'anyOf: [\n')
            sfile.write(ind(indent + 2) + '{\n')
            sfile.write(ind(indent + 3) + f'$ref: "node#/definitions/{a_type}",\n')
            sfile.write(ind(indent + 3) + 'type: "object",\n')
            sfile.write(ind(indent + 3) + 'nullable: true\n')
            sfile.write(ind(indent + 2) + '},\n')
            sfile.write(ind(indent + 2) + '{\n')
            sfile.write(ind(indent + 3) + 'type: "null"\n')
            sfile.write(ind(indent + 2) + '}\n')
            sfile.write(ind(indent + 1) + ']')
        else:
            sfile.write(ind(indent + 1) + f'$ref: "node#/definitions/{a_type}"')
    else:
        sfile.write(ind(indent + 1) + f'type: "{a_type}"')
        if nullable:
            sfile.write(',\n')
            sfile.write(ind(indent + 1) + 'nullable: true')
        if default is not None:
            sfile.write(',\n')
            sfile.write(ind(indent + 1) + f'default: {default}')
        if min is not None:
            sfile.write(',\n')
            sfile.write(ind(indent + 1) + f'minimum: {min}')
        if max is not None:
            sfile.write(',\n')
            sfile.write(ind(indent + 1) + f'maximum: {max}')
    sfile.write('\n')
    sfile.write(ind(indent) + '}')


def schema_array(sfile: TextIO, indent: int, a_type: str, struct: bool = False, nullable: bool = False,
                 default: Any = None, min_items: int | None = None, max_items: int | None = None,
                 min: float | None = None, max: float | None = None) -> None:
    sfile.write('{\n')
    sfile.write(ind(indent + 1) + 'type: "array",\n')
    sfile.write(ind(indent + 1) + 'items: ')
    schema_type(sfile, indent + 1, a_type, struct=struct, nullable=False, min=min, max=max)
    if nullable:
        sfile.write(',\n')
        sfile.write(ind(indent + 1) + 'nullable: true')
    if default is not None:
        sfile.write(',\n')
        sfile.write(ind(indent + 1) + f'default: {default}')
    if min_items is not None:
        sfile.write(',\n')
        sfile.write(ind(indent + 1) + f'minItems: {min_items}')
    if max_items is not None:
        sfile.write(',\n')
        sfile.write(ind(indent + 1) + f'maxItems: {max_items}')
    sfile.write('\n')
    sfile.write(ind(indent) + '}')


def schema_map_string_int(sfile: TextIO, indent: int, nullable: bool = False) -> None:
    sfile.write('{\n')
    sfile.write(ind(indent + 1) + 'type: "object",\n')
    sfile.write(ind(indent + 1) + 'patternProperties: {\n')
    sfile.write(ind(indent + 2) + '"^.*$": ')
    schema_type(sfile, indent + 2, 'integer')
    sfile.write('\n')
    sfile.write(ind(indent + 1) + '}')
    if nullable:
        sfile.write(',\n')
        sfile.write(ind(indent + 1) + 'nullable: true')
    sfile.write('\n')
    sfile.write(ind(indent) + '}')


def generate_operations(operations: Any, tfile: TextIO, sfile: TextIO) -> None:
    tfile.write('\n')
    tfile.write(f'export interface {operations["name"]} {{\n')
    for field in operations['fields']:
        tfile.write(f'    {field["name"]}?: PrincipalValue | null;\n')
    tfile.write('}\n')

    sfile.write('\n')
    sfile.write(f'{ind(2)}{operations["name"]}: {{\n')
    sfile.write(f'{ind(3)}type: "object",\n')
    sfile.write(f'{ind(3)}properties: {{\n')
    for field in operations['fields']:
        sfile.write(f'{ind(4)}"{field["name"]}": ')
        schema_type(sfile, 4, "string", nullable=True)
        sfile.write(',\n')
    sfile.write(f'{ind(3)}}},\n')
    sfile.write(f'{ind(3)}additionalProperties: false\n')
    sfile.write(f'{ind(2)}}},\n')


JS_TYPES = {
    'String': 'string',
    'String[]': 'string[]',
    'short': 'number',
    'int': 'number',
    'long': 'number',
    'float': 'number',
    'boolean': 'boolean',
    'timestamp': 'number',
    'byte[]': 'string',
    'UUID': 'string',
    'String -> int': 'Partial<Record<string, number>>'
}


def to_js_type(api_type: str) -> str:
    js_type = JS_TYPES.get(api_type)
    if js_type is None:
        print('Unrecognized field type: ' + api_type)
        exit(1)
    return js_type


SCHEMA_TYPES = {
    'String': ('string', False),
    'String[]': ('string', True),
    'short': ('integer', False),
    'int': ('integer', False),
    'long': ('integer', False),
    'float': ('number', False),
    'boolean': ('boolean', False),
    'timestamp': ('integer', False),
    'byte[]': ('string', False),
    'UUID': ('string', False),
    'String -> int': schema_map_string_int
}


class Interface:
    data: Any
    output_array: bool = False

    def __init__(self, data: Any) -> None:
        self.data = data

    def get_name(self) -> str:
        raise NotImplementedError

    def get_schema_fields(self) -> list[Any]:
        return self.data.get('fields', [])

    def generate_schema(self, sfile: TextIO) -> None:
        class_name = self.get_name()
        sfile.write(f'\n{ind(2)}{class_name}: {{\n')
        sfile.write(f'{ind(3)}type: "object",\n')
        sfile.write(f'{ind(3)}properties: {{\n')
        required: list[str] = []
        for field in self.get_schema_fields():
            if field.get('type') == 'any':
                continue

            sfile.write(f'{ind(4)}"{field["name"]}": ')
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
                    s_type(sfile, 4, nullable=optional)
                else:
                    assert isinstance(s_type, tuple)
                    t, array = s_type
            constraints = field_constraints(field)
            if t is not None:
                if array:
                    schema_array(sfile, 4, t, struct=struct, nullable=optional, default=default,
                                 min_items=constraints.get('min-items'), max_items=constraints.get('max-items'),
                                 min=constraints.get('min'), max=constraints.get('max'))
                else:
                    schema_type(sfile, 4, t, struct=struct, nullable=optional, default=default,
                                min=constraints.get('min'), max=constraints.get('max'))
            sfile.write(',\n')
        sfile.write(f'{ind(3)}}},\n')
        if len(required) > 0:
            sfile.write(f'{ind(3)}required: [\n')
            for name in required:
                sfile.write(f'{ind(4)}"{name}",\n')
            sfile.write(f'{ind(3)}],\n')
        sfile.write(f'{ind(3)}additionalProperties: false\n')
        sfile.write(f'{ind(2)}}},\n')

        if self.output_array:
            sfile.write(f'\n{ind(2)}{class_name}Array: ')
            schema_array(sfile, 2, class_name, struct=True)
            sfile.write(',\n')


def field_constraints(field: Any) -> dict:
    if 'constraints' not in field:
        return {}

    result = {}
    for constraint in field['constraints']:
        if 'value' in constraint:
            cons = constraint['value']
            if 'min' in cons:
                result['min'] = cons['min']
            if 'max' in cons:
                result['max'] = cons['max']
        if 'items' in constraint:
            cons = constraint['items']
            if 'min' in cons:
                result['min-items'] = cons['min']
            if 'max' in cons:
                result['max-items'] = cons['max']
    return result


class Structure(Interface):
    generated: bool = False
    depends: list[str]
    uses_body: bool = False
    output: bool = False

    def __init__(self, data: Any) -> None:
        super().__init__(data)
        self.depends = [field['struct'] for field in data['fields'] if 'struct' in field]

    def get_name(self) -> str:
        return self.data["name"]

    @property
    def generic(self) -> bool:
        return self.uses_body and self.output

    def generate_class(self, tfile: TextIO, structs: dict[str, Structure]) -> None:
        if self.generic:
            tfile.write(f'\nexport interface {self.data["name"]}Base<B> {{\n')
        else:
            tfile.write(f'\nexport interface {self.data["name"]} {{\n')
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
                t = to_js_type(field['type'])
            if field.get('array', False):
                t += '[]'
            tfile.write(tmpl % (field['name'], t))
        tfile.write('}\n')
        if self.generic:
            tfile.write('\nexport type Encoded{name} = {name}Base<string>;\n'.format(name=self.data['name']))
            tfile.write('export type {name} = {name}Base<Body>;\n'.format(name=self.data['name']))

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


def scan_structures(api: Any) -> dict[str, Structure]:
    structs: dict[str, Structure] = {struct['name']: Structure(struct) for struct in api['structures']}
    scan_body_usage(structs)
    scan_output_usage(api, structs)
    return structs


def generate_structures(structs: dict[str, Structure], tfile: TextIO, sfile: TextIO) -> None:
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
        print('Dependency loop in structures: ' + ', '.join(loop))
        exit(1)


def comma_wrap(s: str, indent: int) -> str:
    max_length = 120 - indent * 4
    result = ''
    while True:
        if len(s) <= max_length:
            result += s
            break
        pos = 0
        while True:
            next = s.find(', ', pos + 1)
            if next < 0 or next > max_length:
                break
            pos = next
        result += s[:pos] + ',\n' + ind(indent)
        s = s[pos + 2:]
    return result


class AuthType(Enum):
    NONE = 0
    OPTIONAL = 1
    REQUIRED = 2


def auth_type(auth: str) -> AuthType:
    variants = auth.split(" or ")
    if variants == ['none'] or variants == ['signature']:
        return AuthType.NONE
    if 'none' in variants or 'signature' in variants or 'optional' in variants:
        return AuthType.OPTIONAL
    return AuthType.REQUIRED


def generate_sagas(api: Any, structs: dict[str, Structure], afile: TextIO) -> None:
    for obj in api['objects']:
        for request in obj.get('requests', []):
            if 'function' not in request:
                continue

            params = '    caller: WithContext<ClientAction> | null, nodeName: RelNodeName | string'
            tail_params = ''
            url_params: dict[str, str] = {}
            flag_name: str | None = None
            flag_js_name: str | None = None
            flags: list[str] = []
            for param in request.get('params', []) + request.get('query', []):
                if 'name' not in param:
                    print('Missing name of parameter of the request "{method} {url}"'
                          .format(method=request['type'], url=request['url']))
                    exit(1)
                name = param['name']
                js_name = 'remoteNodeName' if name == 'nodeName' else name
                url_params[name] = js_name
                if 'enum' in param:
                    js_type = 'API.' + param['enum']
                else:
                    js_type = to_js_type(param['type'])
                if 'flags' in param:
                    flag_name = name
                    flag_js_name = js_name
                    flags = [flag['name'] for flag in param['flags']]
                    for flag in flags:
                        params += ', with{name}: boolean = false'.format(name=flag.capitalize())
                else:
                    if param.get('optional', False):
                        tail_params += f', {js_name}: {js_type} | null = null'
                    else:
                        params += f', {js_name}: {js_type}'
            body = ''
            if 'in' in request:
                if 'type' in request['in']:
                    if request['in']['type'] != 'blob':
                        print('Unrecognised type "{type}" of the input body of the request "{method} {url}"'
                              .format(type=request['in']['type'], method=request['type'], url=request['url']))
                        exit(1)
                    body = ', body: file, onProgress'
                    params += ', file: File, onProgress?: ProgressHandler'
                else:
                    if 'name' not in request['in']:
                        print('Missing name of body of the request "{method} {url}"'
                              .format(method=request['type'], url=request['url']))
                        exit(1)
                    name = request['in']['name']
                    js_type = 'API.' + request['in']['struct']
                    if request['in'].get('array', False):
                        js_type += '[]'
                    body = f', body: {name}'
                    params += f', {name}: {js_type}'
            params += tail_params
            params += ', errorFilter: ErrorFilter = false'
            auth_t = auth_type(request.get('auth', 'none'))
            if auth_t != AuthType.NONE:
                auth = ', auth'
                if auth_t == AuthType.OPTIONAL:
                    params += ', auth: boolean | string = true'
                else:
                    params += ', auth: true | string = true'
            else:
                auth = ''

            method = request['type']
            location: str = request['url']
            if len(url_params) > 0:
                p = re.compile(r'{(\w+)}')
                for name in p.findall(location):
                    if name not in url_params:
                        print('Unknown parameter "{param}" referenced in location "{url}"'
                              .format(param=name, url=request['url']))
                        exit(1)
                    location = location.replace(f'{{{name}}}', f'${{{url_params[name]}}}')
                    del url_params[name]
                location = f'ut`{location}`'
            else:
                location = f'"{location}"'
            subs = []
            for name, js_name in url_params.items():
                if name == js_name:
                    subs.append(name)
                else:
                    subs.append(f'{name}: {js_name}')
            if len(subs) > 0:
                location = 'urlWithParameters({location}, {{{subs}}})'.format(location=location, subs=', '.join(subs))
                if len(location) > 81:
                    location = (location
                                .replace('(', '(\n        ')
                                .replace(', {', ',\n        {')
                                .replace(')', '\n    )'))

            result = 'API.Result'
            result_schema = 'Result'
            result_body = False
            if 'out' in request:
                if 'type' in request['out']:
                    if request['out']['type'] != 'blob':
                        print('Unrecognised type "{type}" of the output body of the request "{method} {url}"'
                              .format(type=request['out']['type'], method=request['type'], url=request['url']))
                        exit(1)
                    result = 'Blob'
                    result_schema = 'blob'
                else:
                    struct = request['out']['struct']
                    result = 'API.' + struct
                    result_schema = struct
                    if struct in structs and structs[struct].uses_body:
                        result_body = True
                    if request['out'].get('array', False):
                        result += '[]'
                        result_schema += 'Array'

            afile.write('\nexport async function {name}(\n{params}\n): Promise<{result}> {{\n\n'
                        .format(name=request['function'], params=comma_wrap(params, 1), result=result))
            if flag_name is not None:
                items = ', '.join('"%s": with%s' % (flag, flag.capitalize()) for flag in flags)
                afile.write(f'    const {flag_js_name} = commaSeparatedFlags({{{items}}});\n')
            afile.write(f'    const location = {location};\n')
            afile.write(f'    return callApi<{result}>({{\n')
            decode_bodies = ''
            if result_body:
                decode_bodies = ', decodeBodies: true'
            call_params = (f'        caller, nodeName, method: "{method}", location{body}{auth}'
                           f', schema: "{result_schema}"{decode_bodies}, errorFilter\n')
            afile.write(comma_wrap(call_params, 2))
            afile.write('    });\n')
            afile.write('}\n')


PREAMBLE_TYPES = '''// This file is generated

export type PrincipalValue = "none" | "private" | "admin" | "owner" | "secret" | "senior" | "enigma" | "major"
    | "signed" | "subscribed" | "public" | "unset" | string;
'''

PREAMBLE_SCHEMAS = '''// This file is generated for schema compiler only, do not use directly

export const NODE_API_SCHEMAS = {
    $id: "node",
    definitions: {
'''

PREAMBLE_SAGAS = '''// This file is generated

import { callApi, ErrorFilter } from "api/node/call";
import * as API from "api/node/api-types";
import { ProgressHandler } from 'api/fetcher';
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { RelNodeName } from "util/rel-node-name";
import { urlWithParameters, ut } from "util/url";
import { commaSeparatedFlags } from "util/misc";
'''


def generate_types(api: Any, outdir: str) -> None:
    structs = scan_structures(api)

    with open(outdir + '/node/api-types.ts', 'w+') as tfile:
        with open(outdir + '/node/api-schemas.mjs', 'w+') as sfile:
            tfile.write(PREAMBLE_TYPES)
            sfile.write(PREAMBLE_SCHEMAS)
            for enum in api['enums']:
                generate_enum(enum, tfile)
            for operations in api['operations']:
                generate_operations(operations, tfile, sfile)
            generate_structures(structs, tfile, sfile)
            sfile.write('\n    }\n')
            sfile.write('}\n')

    with open(outdir + '/node/api-sagas.ts', 'w+') as afile:
        afile.write(PREAMBLE_SAGAS)
        generate_sagas(api, structs, afile)


class Event(Interface):
    def get_name(self) -> str:
        return to_pascal(self.data['type']) + 'Event'

    def get_schema_fields(self) -> list[Any]:
        fields = super().get_schema_fields()
        fields.insert(0, {
            'type': 'String',
            'name': 'type'
        })
        return fields

    def generate_type(self, tfile: TextIO) -> None:
        type = self.data['type']
        name = self.get_name()
        if 'fields' not in self.data:
            tfile.write(f'\nexport type {name} = BaseEvent<"{type}">;\n')
        else:
            tfile.write(f'\nexport interface {name} extends BaseEvent<"{type}"> {{\n')
            for field in self.data['fields']:
                if field.get('optional', False):
                    tmpl = '    %s?: %s | null;\n'
                else:
                    tmpl = '    %s: %s;\n'
                if 'struct' in field:
                    t = field['struct']
                elif 'enum' in field:
                    t = field['enum']
                else:
                    t = to_js_type(field['type'])
                if field.get('array', False):
                    t += '[]'
                tfile.write(tmpl % (field['name'], t))
            tfile.write('}\n')

    def generate(self, tfile: TextIO, sfile: TextIO) -> None:
        self.generate_type(tfile)
        self.generate_schema(sfile)


def scan_events(api: Any) -> dict[str, Event]:
    events: dict[str, Event] = {event['type']: Event(event) for event in api['events']}
    return events


PREAMBLE_EVENT_TYPES = '''// This file is generated

'''

DECLARATIONS_EVENT_TYPES = '''
export interface EventPacket {
    queueStartedAt: number;
    ordinal: number;
    sentAt?: number | null;
    cid?: string | null;
    event: {
        type: string;
    }
}

export interface BaseEvent<T> {
    type: T;
}
'''

PREAMBLE_EVENT_SCHEMAS = '''// This file is generated for schema compiler only, do not use directly

export const EVENT_SCHEMAS = {
    $id: "event",
    definitions: {
        EventPacket: {
            type: "object",
            properties: {
                "queueStartedAt": {
                    type: "integer"
                },
                "ordinal": {
                    type: "integer"
                },
                "sentAt": {
                    type: "integer",
                    nullable: true
                },
                "cid": {
                    type: "string",
                    nullable: true
                },
                "event": {
                    type: "object",
                    properties: {
                        "type": {
                            type: "string"
                        }
                    },
                    required: ["type"]
                }
            },
            additionalProperties: false,
            required: ["queueStartedAt", "ordinal", "event"]
        },
'''

PREAMBLE_EVENT_ACTIONS = '''// This file is generated

import * as immutable from 'object-path-immutable';
import { actionWithPayload, ActionWithPayload } from "state/action-types";
'''

DECLARATIONS_EVENT_ACTIONS = '''
export type EventSource = "HOME" | "NODE" | "RECEIVER";
export type EventActionType<T extends string> = `EVENT_${EventSource}_${T}`;

export type EventAction<E extends BaseEvent<string>> =
    ActionWithPayload<EventActionType<E["type"]>, Omit<E, "type"> & {sourceNode: string | null}>;

export const eventAction = <E extends BaseEvent<string>>(
    event: E & {sourceNode: string | null}, source: EventSource
): EventAction<E> =>
    actionWithPayload(`EVENT_${source}_${event.type}` as const, immutable.del(event, "type"));

export type ClientEventAction =
'''


def generate_event_types_imports(api: Any, tfile: TextIO) -> None:
    structs = set()
    for event in api['events']:
        if 'fields' not in event:
            continue
        for field in event['fields']:
            if 'struct' in field:
                structs.add(field['struct'])
            if 'enum' in field:
                structs.add(field['enum'])
    imports = sorted(list(structs))
    tfile.write('import {\n')
    for name in imports:
        tfile.write(f'{ind(1)}{name},\n')
    tfile.write('} from "api/node/api-types";\n')


def generate_event_types(events: dict[str, Event], tfile: TextIO, sfile: TextIO) -> None:
    for event in events.values():
        event.generate(tfile, sfile)


def generate_event_actions_imports(events: dict[str, Event], afile: TextIO) -> None:
    afile.write('import {\n')
    names = sorted([event.get_name() for event in events.values()] + ['BaseEvent'])
    for name in names:
        afile.write(f'{ind(1)}{name},\n')
    afile.write('} from "api/events";\n')


def generate_event_actions(events: dict[str, Event], afile: TextIO) -> None:
    first = True
    for event in events.values():
        if not first:
            afile.write('\n')
        afile.write(ind(1))
        if first:
            first = False
        else:
            afile.write('| ')
        afile.write(f'EventAction<{event.get_name()}>')
    afile.write(';\n')


def generate_events(api: Any, outdir: str) -> None:
    events = scan_events(api)

    with open(outdir + '/events/api-types.ts', 'w+') as tfile:
        with open(outdir + '/events/api-schemas.mjs', 'w+') as sfile:
            tfile.write(PREAMBLE_EVENT_TYPES)
            generate_event_types_imports(api, tfile)
            tfile.write(DECLARATIONS_EVENT_TYPES)
            sfile.write(PREAMBLE_EVENT_SCHEMAS)
            generate_event_types(events, tfile, sfile)
            sfile.write('\n    }\n')
            sfile.write('}\n')

    with open(outdir + '/events/actions.ts', 'w+') as afile:
        afile.write(PREAMBLE_EVENT_ACTIONS)
        generate_event_actions_imports(events, afile)
        afile.write(DECLARATIONS_EVENT_ACTIONS)
        generate_event_actions(events, afile)


def generate_code(outdir: str) -> None:
    node_api = read_api(sys.argv[1])
    generate_types(node_api, outdir)

    events_api = read_api(sys.argv[2])
    generate_events(events_api, outdir)


if len(sys.argv) < 3 or sys.argv[1] == '':
    print("Usage: js-moera-api <node_api.yml file path> <events.yml file path> <output directory>")
    exit(1)

outdir = sys.argv[3] if len(sys.argv) >= 4 else '.'
generate_code(outdir)
