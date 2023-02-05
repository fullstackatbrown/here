// package: here
// file: model/uta.proto

import * as jspb from "google-protobuf";
import * as model_general_pb from "../model/general_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class CheckoffRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckoffRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckoffRequest): CheckoffRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckoffRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckoffRequest;
  static deserializeBinaryFromReader(message: CheckoffRequest, reader: jspb.BinaryReader): CheckoffRequest;
}

export namespace CheckoffRequest {
  export type AsObject = {
    name: string,
  }
}

export class CheckoffReply extends jspb.Message {
  getOk(): string;
  setOk(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckoffReply.AsObject;
  static toObject(includeInstance: boolean, msg: CheckoffReply): CheckoffReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckoffReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckoffReply;
  static deserializeBinaryFromReader(message: CheckoffReply, reader: jspb.BinaryReader): CheckoffReply;
}

export namespace CheckoffReply {
  export type AsObject = {
    ok: string,
  }
}

export class GetAllSwapRequestsReply extends jspb.Message {
  clearSwaprequestsList(): void;
  getSwaprequestsList(): Array<model_general_pb.SwapRequest>;
  setSwaprequestsList(value: Array<model_general_pb.SwapRequest>): void;
  addSwaprequests(value?: model_general_pb.SwapRequest, index?: number): model_general_pb.SwapRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllSwapRequestsReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllSwapRequestsReply): GetAllSwapRequestsReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAllSwapRequestsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllSwapRequestsReply;
  static deserializeBinaryFromReader(message: GetAllSwapRequestsReply, reader: jspb.BinaryReader): GetAllSwapRequestsReply;
}

export namespace GetAllSwapRequestsReply {
  export type AsObject = {
    swaprequestsList: Array<model_general_pb.SwapRequest.AsObject>,
  }
}

export class HandleSwapRequest extends jspb.Message {
  hasRequest(): boolean;
  clearRequest(): void;
  getRequest(): model_general_pb.SwapRequest | undefined;
  setRequest(value?: model_general_pb.SwapRequest): void;

  getResult(): boolean;
  setResult(value: boolean): void;

  getReason(): string;
  setReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HandleSwapRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HandleSwapRequest): HandleSwapRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HandleSwapRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HandleSwapRequest;
  static deserializeBinaryFromReader(message: HandleSwapRequest, reader: jspb.BinaryReader): HandleSwapRequest;
}

export namespace HandleSwapRequest {
  export type AsObject = {
    request?: model_general_pb.SwapRequest.AsObject,
    result: boolean,
    reason: string,
  }
}

