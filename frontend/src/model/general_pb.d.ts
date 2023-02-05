// package: 
// file: model/general.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class Course extends jspb.Message {
  getCode(): string;
  setCode(value: string): void;

  getTitle(): string;
  setTitle(value: string): void;

  clearSectionsList(): void;
  getSectionsList(): Array<Section>;
  setSectionsList(value: Array<Section>): void;
  addSections(value?: Section, index?: number): Section;

  clearAssignmentsList(): void;
  getAssignmentsList(): Array<Assignment>;
  setAssignmentsList(value: Array<Assignment>): void;
  addAssignments(value?: Assignment, index?: number): Assignment;

  clearGradeoptionsList(): void;
  getGradeoptionsList(): Array<GradeOption>;
  setGradeoptionsList(value: Array<GradeOption>): void;
  addGradeoptions(value?: GradeOption, index?: number): GradeOption;

  clearStudentsList(): void;
  getStudentsList(): Array<Student>;
  setStudentsList(value: Array<Student>): void;
  addStudents(value?: Student, index?: number): Student;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Course.AsObject;
  static toObject(includeInstance: boolean, msg: Course): Course.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Course, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Course;
  static deserializeBinaryFromReader(message: Course, reader: jspb.BinaryReader): Course;
}

export namespace Course {
  export type AsObject = {
    code: string,
    title: string,
    sectionsList: Array<Section.AsObject>,
    assignmentsList: Array<Assignment.AsObject>,
    gradeoptionsList: Array<GradeOption.AsObject>,
    studentsList: Array<Student.AsObject>,
  }
}

export class Section extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getDay(): DayMap[keyof DayMap];
  setDay(value: DayMap[keyof DayMap]): void;

  getStarttime(): string;
  setStarttime(value: string): void;

  getEndtime(): string;
  setEndtime(value: string): void;

  getLocation(): string;
  setLocation(value: string): void;

  getCapacity(): number;
  setCapacity(value: number): void;

  getEnrollment(): number;
  setEnrollment(value: number): void;

  clearStudentsList(): void;
  getStudentsList(): Array<string>;
  setStudentsList(value: Array<string>): void;
  addStudents(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Section.AsObject;
  static toObject(includeInstance: boolean, msg: Section): Section.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Section, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Section;
  static deserializeBinaryFromReader(message: Section, reader: jspb.BinaryReader): Section;
}

export namespace Section {
  export type AsObject = {
    id: string,
    day: DayMap[keyof DayMap],
    starttime: string,
    endtime: string,
    location: string,
    capacity: number,
    enrollment: number,
    studentsList: Array<string>,
  }
}

export class Assignment extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getMandatory(): boolean;
  setMandatory(value: boolean): void;

  getStartdate(): string;
  setStartdate(value: string): void;

  getEnddate(): string;
  setEnddate(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Assignment.AsObject;
  static toObject(includeInstance: boolean, msg: Assignment): Assignment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Assignment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Assignment;
  static deserializeBinaryFromReader(message: Assignment, reader: jspb.BinaryReader): Assignment;
}

export namespace Assignment {
  export type AsObject = {
    name: string,
    mandatory: boolean,
    startdate: string,
    enddate: string,
  }
}

export class Student extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getSection(): string;
  setSection(value: string): void;

  getGradesMap(): jspb.Map<string, string>;
  clearGradesMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Student.AsObject;
  static toObject(includeInstance: boolean, msg: Student): Student.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Student, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Student;
  static deserializeBinaryFromReader(message: Student, reader: jspb.BinaryReader): Student;
}

export namespace Student {
  export type AsObject = {
    id: string,
    section: string,
    gradesMap: Array<[string, string]>,
  }
}

export class GradeOption extends jspb.Message {
  getGradeoption(): string;
  setGradeoption(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GradeOption.AsObject;
  static toObject(includeInstance: boolean, msg: GradeOption): GradeOption.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GradeOption, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GradeOption;
  static deserializeBinaryFromReader(message: GradeOption, reader: jspb.BinaryReader): GradeOption;
}

export namespace GradeOption {
  export type AsObject = {
    gradeoption: string,
  }
}

export class SwapRequest extends jspb.Message {
  getStudentid(): string;
  setStudentid(value: string): void;

  getFrom(): string;
  setFrom(value: string): void;

  getTo(): string;
  setTo(value: string): void;

  getReason(): string;
  setReason(value: string): void;

  hasRequesttime(): boolean;
  clearRequesttime(): void;
  getRequesttime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setRequesttime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SwapRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SwapRequest): SwapRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SwapRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SwapRequest;
  static deserializeBinaryFromReader(message: SwapRequest, reader: jspb.BinaryReader): SwapRequest;
}

export namespace SwapRequest {
  export type AsObject = {
    studentid: string,
    from: string,
    to: string,
    reason: string,
    requesttime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export interface DayMap {
  SUNDAY: 0;
  MONDAY: 1;
  TUESDAY: 2;
  WEDNESDAY: 3;
  THURSDAY: 4;
  FRIDAY: 5;
  SATURDAY: 6;
}

export const Day: DayMap;

