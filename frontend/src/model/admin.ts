/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import { Empty } from "../google/protobuf/empty";
import { Section } from "./general";

export const protobufPackage = "here";

export interface GetAllSectionsReply {
  sections: Section[];
}

function createBaseGetAllSectionsReply(): GetAllSectionsReply {
  return { sections: [] };
}

export const GetAllSectionsReply = {
  encode(message: GetAllSectionsReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.sections) {
      Section.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAllSectionsReply {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllSectionsReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sections.push(Section.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAllSectionsReply {
    return { sections: Array.isArray(object?.sections) ? object.sections.map((e: any) => Section.fromJSON(e)) : [] };
  },

  toJSON(message: GetAllSectionsReply): unknown {
    const obj: any = {};
    if (message.sections) {
      obj.sections = message.sections.map((e) => e ? Section.toJSON(e) : undefined);
    } else {
      obj.sections = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAllSectionsReply>, I>>(object: I): GetAllSectionsReply {
    const message = createBaseGetAllSectionsReply();
    message.sections = object.sections?.map((e) => Section.fromPartial(e)) || [];
    return message;
  },
};

export interface Admin {
  GetAllSections(request: Empty): Promise<GetAllSectionsReply>;
  AddSection(request: Section): Promise<Empty>;
  EditSection(request: Section): Promise<Empty>;
  DeleteSection(request: Section): Promise<Empty>;
}

export class AdminClientImpl implements Admin {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "here.Admin";
    this.rpc = rpc;
    this.GetAllSections = this.GetAllSections.bind(this);
    this.AddSection = this.AddSection.bind(this);
    this.EditSection = this.EditSection.bind(this);
    this.DeleteSection = this.DeleteSection.bind(this);
  }
  GetAllSections(request: Empty): Promise<GetAllSectionsReply> {
    const data = Empty.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetAllSections", data);
    return promise.then((data) => GetAllSectionsReply.decode(new _m0.Reader(data)));
  }

  AddSection(request: Section): Promise<Empty> {
    const data = Section.encode(request).finish();
    const promise = this.rpc.request(this.service, "AddSection", data);
    return promise.then((data) => Empty.decode(new _m0.Reader(data)));
  }

  EditSection(request: Section): Promise<Empty> {
    const data = Section.encode(request).finish();
    const promise = this.rpc.request(this.service, "EditSection", data);
    return promise.then((data) => Empty.decode(new _m0.Reader(data)));
  }

  DeleteSection(request: Section): Promise<Empty> {
    const data = Section.encode(request).finish();
    const promise = this.rpc.request(this.service, "DeleteSection", data);
    return promise.then((data) => Empty.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };
