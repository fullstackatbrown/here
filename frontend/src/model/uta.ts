/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import { Empty } from "../google/protobuf/empty";
import { GradeOption, SwapRequest } from "./general";

export const protobufPackage = "here";

export interface CheckoffRequest {
  name: string;
}

export interface CheckoffReply {
  ok: string;
}

export interface GetAllSwapRequestsReply {
  swapRequests: SwapRequest[];
}

export interface HandleSwapRequest {
  request: SwapRequest | undefined;
  result: boolean;
  reason: string;
}

function createBaseCheckoffRequest(): CheckoffRequest {
  return { name: "" };
}

export const CheckoffRequest = {
  encode(message: CheckoffRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckoffRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckoffRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CheckoffRequest {
    return { name: isSet(object.name) ? String(object.name) : "" };
  },

  toJSON(message: CheckoffRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CheckoffRequest>, I>>(object: I): CheckoffRequest {
    const message = createBaseCheckoffRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseCheckoffReply(): CheckoffReply {
  return { ok: "" };
}

export const CheckoffReply = {
  encode(message: CheckoffReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ok !== "") {
      writer.uint32(10).string(message.ok);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckoffReply {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckoffReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ok = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CheckoffReply {
    return { ok: isSet(object.ok) ? String(object.ok) : "" };
  },

  toJSON(message: CheckoffReply): unknown {
    const obj: any = {};
    message.ok !== undefined && (obj.ok = message.ok);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CheckoffReply>, I>>(object: I): CheckoffReply {
    const message = createBaseCheckoffReply();
    message.ok = object.ok ?? "";
    return message;
  },
};

function createBaseGetAllSwapRequestsReply(): GetAllSwapRequestsReply {
  return { swapRequests: [] };
}

export const GetAllSwapRequestsReply = {
  encode(message: GetAllSwapRequestsReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.swapRequests) {
      SwapRequest.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAllSwapRequestsReply {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllSwapRequestsReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.swapRequests.push(SwapRequest.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAllSwapRequestsReply {
    return {
      swapRequests: Array.isArray(object?.swapRequests)
        ? object.swapRequests.map((e: any) => SwapRequest.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetAllSwapRequestsReply): unknown {
    const obj: any = {};
    if (message.swapRequests) {
      obj.swapRequests = message.swapRequests.map((e) => e ? SwapRequest.toJSON(e) : undefined);
    } else {
      obj.swapRequests = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAllSwapRequestsReply>, I>>(object: I): GetAllSwapRequestsReply {
    const message = createBaseGetAllSwapRequestsReply();
    message.swapRequests = object.swapRequests?.map((e) => SwapRequest.fromPartial(e)) || [];
    return message;
  },
};

function createBaseHandleSwapRequest(): HandleSwapRequest {
  return { request: undefined, result: false, reason: "" };
}

export const HandleSwapRequest = {
  encode(message: HandleSwapRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.request !== undefined) {
      SwapRequest.encode(message.request, writer.uint32(10).fork()).ldelim();
    }
    if (message.result === true) {
      writer.uint32(16).bool(message.result);
    }
    if (message.reason !== "") {
      writer.uint32(26).string(message.reason);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HandleSwapRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHandleSwapRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.request = SwapRequest.decode(reader, reader.uint32());
          break;
        case 2:
          message.result = reader.bool();
          break;
        case 3:
          message.reason = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HandleSwapRequest {
    return {
      request: isSet(object.request) ? SwapRequest.fromJSON(object.request) : undefined,
      result: isSet(object.result) ? Boolean(object.result) : false,
      reason: isSet(object.reason) ? String(object.reason) : "",
    };
  },

  toJSON(message: HandleSwapRequest): unknown {
    const obj: any = {};
    message.request !== undefined && (obj.request = message.request ? SwapRequest.toJSON(message.request) : undefined);
    message.result !== undefined && (obj.result = message.result);
    message.reason !== undefined && (obj.reason = message.reason);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<HandleSwapRequest>, I>>(object: I): HandleSwapRequest {
    const message = createBaseHandleSwapRequest();
    message.request = (object.request !== undefined && object.request !== null)
      ? SwapRequest.fromPartial(object.request)
      : undefined;
    message.result = object.result ?? false;
    message.reason = object.reason ?? "";
    return message;
  },
};

export interface UTA {
  Checkoff(request: CheckoffRequest): Promise<CheckoffReply>;
  AddGradeOption(request: GradeOption): Promise<Empty>;
  DeleteGradeOption(request: GradeOption): Promise<Empty>;
  GetAllSwapRequests(request: Empty): Promise<GetAllSwapRequestsReply>;
  HandleSwapRequests(request: HandleSwapRequest): Promise<Empty>;
}

export class UTAClientImpl implements UTA {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "here.UTA";
    this.rpc = rpc;
    this.Checkoff = this.Checkoff.bind(this);
    this.AddGradeOption = this.AddGradeOption.bind(this);
    this.DeleteGradeOption = this.DeleteGradeOption.bind(this);
    this.GetAllSwapRequests = this.GetAllSwapRequests.bind(this);
    this.HandleSwapRequests = this.HandleSwapRequests.bind(this);
  }
  Checkoff(request: CheckoffRequest): Promise<CheckoffReply> {
    const data = CheckoffRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Checkoff", data);
    return promise.then((data) => CheckoffReply.decode(new _m0.Reader(data)));
  }

  AddGradeOption(request: GradeOption): Promise<Empty> {
    const data = GradeOption.encode(request).finish();
    const promise = this.rpc.request(this.service, "AddGradeOption", data);
    return promise.then((data) => Empty.decode(new _m0.Reader(data)));
  }

  DeleteGradeOption(request: GradeOption): Promise<Empty> {
    const data = GradeOption.encode(request).finish();
    const promise = this.rpc.request(this.service, "DeleteGradeOption", data);
    return promise.then((data) => Empty.decode(new _m0.Reader(data)));
  }

  GetAllSwapRequests(request: Empty): Promise<GetAllSwapRequestsReply> {
    const data = Empty.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetAllSwapRequests", data);
    return promise.then((data) => GetAllSwapRequestsReply.decode(new _m0.Reader(data)));
  }

  HandleSwapRequests(request: HandleSwapRequest): Promise<Empty> {
    const data = HandleSwapRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "HandleSwapRequests", data);
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
