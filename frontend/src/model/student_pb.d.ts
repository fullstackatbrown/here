// package: here
// file: model/student.proto

import * as jspb from "google-protobuf";
import * as model_general_pb from "../model/general_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class StudentRequest extends jspb.Message {
  getStudentid(): string;
  setStudentid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StudentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StudentRequest): StudentRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StudentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StudentRequest;
  static deserializeBinaryFromReader(message: StudentRequest, reader: jspb.BinaryReader): StudentRequest;
}

export namespace StudentRequest {
  export type AsObject = {
    studentid: string,
  }
}

export class GetGradesReply extends jspb.Message {
  getGradesMap(): jspb.Map<string, string>;
  clearGradesMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetGradesReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetGradesReply): GetGradesReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetGradesReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetGradesReply;
  static deserializeBinaryFromReader(message: GetGradesReply, reader: jspb.BinaryReader): GetGradesReply;
}

export namespace GetGradesReply {
  export type AsObject = {
    gradesMap: Array<[string, string]>,
  }
}

export class GetCoursesReply extends jspb.Message {
  clearCourseidList(): void;
  getCourseidList(): Array<string>;
  setCourseidList(value: Array<string>): void;
  addCourseid(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCoursesReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetCoursesReply): GetCoursesReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCoursesReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCoursesReply;
  static deserializeBinaryFromReader(message: GetCoursesReply, reader: jspb.BinaryReader): GetCoursesReply;
}

export namespace GetCoursesReply {
  export type AsObject = {
    courseidList: Array<string>,
  }
}

export class ChooseSectionRequest extends jspb.Message {
  hasSection(): boolean;
  clearSection(): void;
  getSection(): model_general_pb.Section | undefined;
  setSection(value?: model_general_pb.Section): void;

  getStudentid(): string;
  setStudentid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChooseSectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ChooseSectionRequest): ChooseSectionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChooseSectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChooseSectionRequest;
  static deserializeBinaryFromReader(message: ChooseSectionRequest, reader: jspb.BinaryReader): ChooseSectionRequest;
}

export namespace ChooseSectionRequest {
  export type AsObject = {
    section?: model_general_pb.Section.AsObject,
    studentid: string,
  }
}

export class ChooseSectionReply extends jspb.Message {
  getOk(): boolean;
  setOk(value: boolean): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChooseSectionReply.AsObject;
  static toObject(includeInstance: boolean, msg: ChooseSectionReply): ChooseSectionReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChooseSectionReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChooseSectionReply;
  static deserializeBinaryFromReader(message: ChooseSectionReply, reader: jspb.BinaryReader): ChooseSectionReply;
}

export namespace ChooseSectionReply {
  export type AsObject = {
    ok: boolean,
    message: string,
  }
}

