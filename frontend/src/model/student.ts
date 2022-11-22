/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import { Empty } from "../google/protobuf/empty";
import { Section, SwapRequest } from "./general";

export const protobufPackage = "here";

export interface StudentRequest {
  studentId: string;
}

export interface GetGradesReply {
  /** map from assignment name to grade option */
  grades: { [key: string]: string };
}

export interface GetGradesReply_GradesEntry {
  key: string;
  value: string;
}

export interface GetCoursesReply {
  courseId: string[];
}

export interface ChooseSectionRequest {
  section: Section | undefined;
  studentId: string;
}

export interface ChooseSectionReply {
  ok: boolean;
  message: string;
}

function createBaseStudentRequest(): StudentRequest {
  return { studentId: "" };
}

export const StudentRequest = {
  encode(message: StudentRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.studentId !== "") {
      writer.uint32(10).string(message.studentId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StudentRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStudentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.studentId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StudentRequest {
    return { studentId: isSet(object.studentId) ? String(object.studentId) : "" };
  },

  toJSON(message: StudentRequest): unknown {
    const obj: any = {};
    message.studentId !== undefined && (obj.studentId = message.studentId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StudentRequest>, I>>(object: I): StudentRequest {
    const message = createBaseStudentRequest();
    message.studentId = object.studentId ?? "";
    return message;
  },
};

function createBaseGetGradesReply(): GetGradesReply {
  return { grades: {} };
}

export const GetGradesReply = {
  encode(message: GetGradesReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.grades).forEach(([key, value]) => {
      GetGradesReply_GradesEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetGradesReply {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetGradesReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = GetGradesReply_GradesEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.grades[entry1.key] = entry1.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetGradesReply {
    return {
      grades: isObject(object.grades)
        ? Object.entries(object.grades).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: GetGradesReply): unknown {
    const obj: any = {};
    obj.grades = {};
    if (message.grades) {
      Object.entries(message.grades).forEach(([k, v]) => {
        obj.grades[k] = v;
      });
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetGradesReply>, I>>(object: I): GetGradesReply {
    const message = createBaseGetGradesReply();
    message.grades = Object.entries(object.grades ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseGetGradesReply_GradesEntry(): GetGradesReply_GradesEntry {
  return { key: "", value: "" };
}

export const GetGradesReply_GradesEntry = {
  encode(message: GetGradesReply_GradesEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetGradesReply_GradesEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetGradesReply_GradesEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetGradesReply_GradesEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: GetGradesReply_GradesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetGradesReply_GradesEntry>, I>>(object: I): GetGradesReply_GradesEntry {
    const message = createBaseGetGradesReply_GradesEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseGetCoursesReply(): GetCoursesReply {
  return { courseId: [] };
}

export const GetCoursesReply = {
  encode(message: GetCoursesReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.courseId) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCoursesReply {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCoursesReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.courseId.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCoursesReply {
    return { courseId: Array.isArray(object?.courseId) ? object.courseId.map((e: any) => String(e)) : [] };
  },

  toJSON(message: GetCoursesReply): unknown {
    const obj: any = {};
    if (message.courseId) {
      obj.courseId = message.courseId.map((e) => e);
    } else {
      obj.courseId = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetCoursesReply>, I>>(object: I): GetCoursesReply {
    const message = createBaseGetCoursesReply();
    message.courseId = object.courseId?.map((e) => e) || [];
    return message;
  },
};

function createBaseChooseSectionRequest(): ChooseSectionRequest {
  return { section: undefined, studentId: "" };
}

export const ChooseSectionRequest = {
  encode(message: ChooseSectionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.section !== undefined) {
      Section.encode(message.section, writer.uint32(10).fork()).ldelim();
    }
    if (message.studentId !== "") {
      writer.uint32(18).string(message.studentId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChooseSectionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChooseSectionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.section = Section.decode(reader, reader.uint32());
          break;
        case 2:
          message.studentId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChooseSectionRequest {
    return {
      section: isSet(object.section) ? Section.fromJSON(object.section) : undefined,
      studentId: isSet(object.studentId) ? String(object.studentId) : "",
    };
  },

  toJSON(message: ChooseSectionRequest): unknown {
    const obj: any = {};
    message.section !== undefined && (obj.section = message.section ? Section.toJSON(message.section) : undefined);
    message.studentId !== undefined && (obj.studentId = message.studentId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ChooseSectionRequest>, I>>(object: I): ChooseSectionRequest {
    const message = createBaseChooseSectionRequest();
    message.section = (object.section !== undefined && object.section !== null)
      ? Section.fromPartial(object.section)
      : undefined;
    message.studentId = object.studentId ?? "";
    return message;
  },
};

function createBaseChooseSectionReply(): ChooseSectionReply {
  return { ok: false, message: "" };
}

export const ChooseSectionReply = {
  encode(message: ChooseSectionReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ok === true) {
      writer.uint32(8).bool(message.ok);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChooseSectionReply {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChooseSectionReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ok = reader.bool();
          break;
        case 2:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChooseSectionReply {
    return {
      ok: isSet(object.ok) ? Boolean(object.ok) : false,
      message: isSet(object.message) ? String(object.message) : "",
    };
  },

  toJSON(message: ChooseSectionReply): unknown {
    const obj: any = {};
    message.ok !== undefined && (obj.ok = message.ok);
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ChooseSectionReply>, I>>(object: I): ChooseSectionReply {
    const message = createBaseChooseSectionReply();
    message.ok = object.ok ?? false;
    message.message = object.message ?? "";
    return message;
  },
};

export interface Student {
  GetCourses(request: StudentRequest): Promise<GetCoursesReply>;
  GetGrades(request: StudentRequest): Promise<GetGradesReply>;
  SubmitSwapRequests(request: SwapRequest): Promise<Empty>;
  ChooseSection(request: ChooseSectionRequest): Promise<ChooseSectionReply>;
}

export class StudentClientImpl implements Student {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "here.Student";
    this.rpc = rpc;
    this.GetCourses = this.GetCourses.bind(this);
    this.GetGrades = this.GetGrades.bind(this);
    this.SubmitSwapRequests = this.SubmitSwapRequests.bind(this);
    this.ChooseSection = this.ChooseSection.bind(this);
  }
  GetCourses(request: StudentRequest): Promise<GetCoursesReply> {
    const data = StudentRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetCourses", data);
    return promise.then((data) => GetCoursesReply.decode(new _m0.Reader(data)));
  }

  GetGrades(request: StudentRequest): Promise<GetGradesReply> {
    const data = StudentRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetGrades", data);
    return promise.then((data) => GetGradesReply.decode(new _m0.Reader(data)));
  }

  SubmitSwapRequests(request: SwapRequest): Promise<Empty> {
    const data = SwapRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "SubmitSwapRequests", data);
    return promise.then((data) => Empty.decode(new _m0.Reader(data)));
  }

  ChooseSection(request: ChooseSectionRequest): Promise<ChooseSectionReply> {
    const data = ChooseSectionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ChooseSection", data);
    return promise.then((data) => ChooseSectionReply.decode(new _m0.Reader(data)));
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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
