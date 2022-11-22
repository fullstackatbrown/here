/* eslint-disable */
import * as _m0 from "protobufjs/minimal";
import { Timestamp } from "../google/protobuf/timestamp";

export const protobufPackage = "";

export enum Day {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  UNRECOGNIZED = -1,
}

export function dayFromJSON(object: any): Day {
  switch (object) {
    case 0:
    case "SUNDAY":
      return Day.SUNDAY;
    case 1:
    case "MONDAY":
      return Day.MONDAY;
    case 2:
    case "TUESDAY":
      return Day.TUESDAY;
    case 3:
    case "WEDNESDAY":
      return Day.WEDNESDAY;
    case 4:
    case "THURSDAY":
      return Day.THURSDAY;
    case 5:
    case "FRIDAY":
      return Day.FRIDAY;
    case 6:
    case "SATURDAY":
      return Day.SATURDAY;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Day.UNRECOGNIZED;
  }
}

export function dayToJSON(object: Day): string {
  switch (object) {
    case Day.SUNDAY:
      return "SUNDAY";
    case Day.MONDAY:
      return "MONDAY";
    case Day.TUESDAY:
      return "TUESDAY";
    case Day.WEDNESDAY:
      return "WEDNESDAY";
    case Day.THURSDAY:
      return "THURSDAY";
    case Day.FRIDAY:
      return "FRIDAY";
    case Day.SATURDAY:
      return "SATURDAY";
    case Day.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Course {
  code: string;
  title: string;
  sections: Section[];
  assignments: Assignment[];
  gradeOptions: GradeOption[];
  students: Student[];
}

export interface Section {
  id: string;
  day: Day;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  enrollment: number;
  /** student id */
  students: string[];
}

export interface Assignment {
  name: string;
  mandatory: boolean;
  startDate: string;
  endDate: string;
}

export interface Student {
  id: string;
  /** section id */
  section: string;
  /** map from assignment name to grade option */
  grades: { [key: string]: string };
}

export interface Student_GradesEntry {
  key: string;
  value: string;
}

export interface GradeOption {
  gradeOption: string;
}

export interface SwapRequest {
  studentId: string;
  from: string;
  to: string;
  reason: string;
  requestTime: Date | undefined;
}

function createBaseCourse(): Course {
  return { code: "", title: "", sections: [], assignments: [], gradeOptions: [], students: [] };
}

export const Course = {
  encode(message: Course, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== "") {
      writer.uint32(10).string(message.code);
    }
    if (message.title !== "") {
      writer.uint32(18).string(message.title);
    }
    for (const v of message.sections) {
      Section.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.assignments) {
      Assignment.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.gradeOptions) {
      GradeOption.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.students) {
      Student.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Course {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCourse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.code = reader.string();
          break;
        case 2:
          message.title = reader.string();
          break;
        case 3:
          message.sections.push(Section.decode(reader, reader.uint32()));
          break;
        case 4:
          message.assignments.push(Assignment.decode(reader, reader.uint32()));
          break;
        case 5:
          message.gradeOptions.push(GradeOption.decode(reader, reader.uint32()));
          break;
        case 6:
          message.students.push(Student.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Course {
    return {
      code: isSet(object.code) ? String(object.code) : "",
      title: isSet(object.title) ? String(object.title) : "",
      sections: Array.isArray(object?.sections) ? object.sections.map((e: any) => Section.fromJSON(e)) : [],
      assignments: Array.isArray(object?.assignments) ? object.assignments.map((e: any) => Assignment.fromJSON(e)) : [],
      gradeOptions: Array.isArray(object?.gradeOptions)
        ? object.gradeOptions.map((e: any) => GradeOption.fromJSON(e))
        : [],
      students: Array.isArray(object?.students) ? object.students.map((e: any) => Student.fromJSON(e)) : [],
    };
  },

  toJSON(message: Course): unknown {
    const obj: any = {};
    message.code !== undefined && (obj.code = message.code);
    message.title !== undefined && (obj.title = message.title);
    if (message.sections) {
      obj.sections = message.sections.map((e) => e ? Section.toJSON(e) : undefined);
    } else {
      obj.sections = [];
    }
    if (message.assignments) {
      obj.assignments = message.assignments.map((e) => e ? Assignment.toJSON(e) : undefined);
    } else {
      obj.assignments = [];
    }
    if (message.gradeOptions) {
      obj.gradeOptions = message.gradeOptions.map((e) => e ? GradeOption.toJSON(e) : undefined);
    } else {
      obj.gradeOptions = [];
    }
    if (message.students) {
      obj.students = message.students.map((e) => e ? Student.toJSON(e) : undefined);
    } else {
      obj.students = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Course>, I>>(object: I): Course {
    const message = createBaseCourse();
    message.code = object.code ?? "";
    message.title = object.title ?? "";
    message.sections = object.sections?.map((e) => Section.fromPartial(e)) || [];
    message.assignments = object.assignments?.map((e) => Assignment.fromPartial(e)) || [];
    message.gradeOptions = object.gradeOptions?.map((e) => GradeOption.fromPartial(e)) || [];
    message.students = object.students?.map((e) => Student.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSection(): Section {
  return { id: "", day: 0, startTime: "", endTime: "", location: "", capacity: 0, enrollment: 0, students: [] };
}

export const Section = {
  encode(message: Section, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.day !== 0) {
      writer.uint32(16).int32(message.day);
    }
    if (message.startTime !== "") {
      writer.uint32(26).string(message.startTime);
    }
    if (message.endTime !== "") {
      writer.uint32(34).string(message.endTime);
    }
    if (message.location !== "") {
      writer.uint32(42).string(message.location);
    }
    if (message.capacity !== 0) {
      writer.uint32(48).int32(message.capacity);
    }
    if (message.enrollment !== 0) {
      writer.uint32(56).int32(message.enrollment);
    }
    for (const v of message.students) {
      writer.uint32(66).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Section {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSection();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.day = reader.int32() as any;
          break;
        case 3:
          message.startTime = reader.string();
          break;
        case 4:
          message.endTime = reader.string();
          break;
        case 5:
          message.location = reader.string();
          break;
        case 6:
          message.capacity = reader.int32();
          break;
        case 7:
          message.enrollment = reader.int32();
          break;
        case 8:
          message.students.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Section {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      day: isSet(object.day) ? dayFromJSON(object.day) : 0,
      startTime: isSet(object.startTime) ? String(object.startTime) : "",
      endTime: isSet(object.endTime) ? String(object.endTime) : "",
      location: isSet(object.location) ? String(object.location) : "",
      capacity: isSet(object.capacity) ? Number(object.capacity) : 0,
      enrollment: isSet(object.enrollment) ? Number(object.enrollment) : 0,
      students: Array.isArray(object?.students) ? object.students.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: Section): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.day !== undefined && (obj.day = dayToJSON(message.day));
    message.startTime !== undefined && (obj.startTime = message.startTime);
    message.endTime !== undefined && (obj.endTime = message.endTime);
    message.location !== undefined && (obj.location = message.location);
    message.capacity !== undefined && (obj.capacity = Math.round(message.capacity));
    message.enrollment !== undefined && (obj.enrollment = Math.round(message.enrollment));
    if (message.students) {
      obj.students = message.students.map((e) => e);
    } else {
      obj.students = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Section>, I>>(object: I): Section {
    const message = createBaseSection();
    message.id = object.id ?? "";
    message.day = object.day ?? 0;
    message.startTime = object.startTime ?? "";
    message.endTime = object.endTime ?? "";
    message.location = object.location ?? "";
    message.capacity = object.capacity ?? 0;
    message.enrollment = object.enrollment ?? 0;
    message.students = object.students?.map((e) => e) || [];
    return message;
  },
};

function createBaseAssignment(): Assignment {
  return { name: "", mandatory: false, startDate: "", endDate: "" };
}

export const Assignment = {
  encode(message: Assignment, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.mandatory === true) {
      writer.uint32(16).bool(message.mandatory);
    }
    if (message.startDate !== "") {
      writer.uint32(26).string(message.startDate);
    }
    if (message.endDate !== "") {
      writer.uint32(34).string(message.endDate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Assignment {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAssignment();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.mandatory = reader.bool();
          break;
        case 3:
          message.startDate = reader.string();
          break;
        case 4:
          message.endDate = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Assignment {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      mandatory: isSet(object.mandatory) ? Boolean(object.mandatory) : false,
      startDate: isSet(object.startDate) ? String(object.startDate) : "",
      endDate: isSet(object.endDate) ? String(object.endDate) : "",
    };
  },

  toJSON(message: Assignment): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.mandatory !== undefined && (obj.mandatory = message.mandatory);
    message.startDate !== undefined && (obj.startDate = message.startDate);
    message.endDate !== undefined && (obj.endDate = message.endDate);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Assignment>, I>>(object: I): Assignment {
    const message = createBaseAssignment();
    message.name = object.name ?? "";
    message.mandatory = object.mandatory ?? false;
    message.startDate = object.startDate ?? "";
    message.endDate = object.endDate ?? "";
    return message;
  },
};

function createBaseStudent(): Student {
  return { id: "", section: "", grades: {} };
}

export const Student = {
  encode(message: Student, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.section !== "") {
      writer.uint32(18).string(message.section);
    }
    Object.entries(message.grades).forEach(([key, value]) => {
      Student_GradesEntry.encode({ key: key as any, value }, writer.uint32(26).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Student {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStudent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.section = reader.string();
          break;
        case 3:
          const entry3 = Student_GradesEntry.decode(reader, reader.uint32());
          if (entry3.value !== undefined) {
            message.grades[entry3.key] = entry3.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Student {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      section: isSet(object.section) ? String(object.section) : "",
      grades: isObject(object.grades)
        ? Object.entries(object.grades).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: Student): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.section !== undefined && (obj.section = message.section);
    obj.grades = {};
    if (message.grades) {
      Object.entries(message.grades).forEach(([k, v]) => {
        obj.grades[k] = v;
      });
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Student>, I>>(object: I): Student {
    const message = createBaseStudent();
    message.id = object.id ?? "";
    message.section = object.section ?? "";
    message.grades = Object.entries(object.grades ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseStudent_GradesEntry(): Student_GradesEntry {
  return { key: "", value: "" };
}

export const Student_GradesEntry = {
  encode(message: Student_GradesEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Student_GradesEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStudent_GradesEntry();
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

  fromJSON(object: any): Student_GradesEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? String(object.value) : "" };
  },

  toJSON(message: Student_GradesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Student_GradesEntry>, I>>(object: I): Student_GradesEntry {
    const message = createBaseStudent_GradesEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseGradeOption(): GradeOption {
  return { gradeOption: "" };
}

export const GradeOption = {
  encode(message: GradeOption, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.gradeOption !== "") {
      writer.uint32(10).string(message.gradeOption);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GradeOption {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGradeOption();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.gradeOption = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GradeOption {
    return { gradeOption: isSet(object.gradeOption) ? String(object.gradeOption) : "" };
  },

  toJSON(message: GradeOption): unknown {
    const obj: any = {};
    message.gradeOption !== undefined && (obj.gradeOption = message.gradeOption);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GradeOption>, I>>(object: I): GradeOption {
    const message = createBaseGradeOption();
    message.gradeOption = object.gradeOption ?? "";
    return message;
  },
};

function createBaseSwapRequest(): SwapRequest {
  return { studentId: "", from: "", to: "", reason: "", requestTime: undefined };
}

export const SwapRequest = {
  encode(message: SwapRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.studentId !== "") {
      writer.uint32(10).string(message.studentId);
    }
    if (message.from !== "") {
      writer.uint32(18).string(message.from);
    }
    if (message.to !== "") {
      writer.uint32(26).string(message.to);
    }
    if (message.reason !== "") {
      writer.uint32(34).string(message.reason);
    }
    if (message.requestTime !== undefined) {
      Timestamp.encode(toTimestamp(message.requestTime), writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SwapRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSwapRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.studentId = reader.string();
          break;
        case 2:
          message.from = reader.string();
          break;
        case 3:
          message.to = reader.string();
          break;
        case 4:
          message.reason = reader.string();
          break;
        case 5:
          message.requestTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SwapRequest {
    return {
      studentId: isSet(object.studentId) ? String(object.studentId) : "",
      from: isSet(object.from) ? String(object.from) : "",
      to: isSet(object.to) ? String(object.to) : "",
      reason: isSet(object.reason) ? String(object.reason) : "",
      requestTime: isSet(object.requestTime) ? fromJsonTimestamp(object.requestTime) : undefined,
    };
  },

  toJSON(message: SwapRequest): unknown {
    const obj: any = {};
    message.studentId !== undefined && (obj.studentId = message.studentId);
    message.from !== undefined && (obj.from = message.from);
    message.to !== undefined && (obj.to = message.to);
    message.reason !== undefined && (obj.reason = message.reason);
    message.requestTime !== undefined && (obj.requestTime = message.requestTime.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SwapRequest>, I>>(object: I): SwapRequest {
    const message = createBaseSwapRequest();
    message.studentId = object.studentId ?? "";
    message.from = object.from ?? "";
    message.to = object.to ?? "";
    message.reason = object.reason ?? "";
    message.requestTime = object.requestTime ?? undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
