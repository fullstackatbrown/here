// package: here
// file: model/student.proto

import * as model_student_pb from "../model/student_pb";
import * as model_general_pb from "../model/general_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import {grpc} from "@improbable-eng/grpc-web";

type StudentGetCourses = {
  readonly methodName: string;
  readonly service: typeof Student;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_student_pb.StudentRequest;
  readonly responseType: typeof model_student_pb.GetCoursesReply;
};

type StudentGetGrades = {
  readonly methodName: string;
  readonly service: typeof Student;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_student_pb.StudentRequest;
  readonly responseType: typeof model_student_pb.GetGradesReply;
};

type StudentSubmitSwapRequests = {
  readonly methodName: string;
  readonly service: typeof Student;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_general_pb.SwapRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type StudentChooseSection = {
  readonly methodName: string;
  readonly service: typeof Student;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_student_pb.ChooseSectionRequest;
  readonly responseType: typeof model_student_pb.ChooseSectionReply;
};

export class Student {
  static readonly serviceName: string;
  static readonly GetCourses: StudentGetCourses;
  static readonly GetGrades: StudentGetGrades;
  static readonly SubmitSwapRequests: StudentSubmitSwapRequests;
  static readonly ChooseSection: StudentChooseSection;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class StudentClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getCourses(
    requestMessage: model_student_pb.StudentRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_student_pb.GetCoursesReply|null) => void
  ): UnaryResponse;
  getCourses(
    requestMessage: model_student_pb.StudentRequest,
    callback: (error: ServiceError|null, responseMessage: model_student_pb.GetCoursesReply|null) => void
  ): UnaryResponse;
  getGrades(
    requestMessage: model_student_pb.StudentRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_student_pb.GetGradesReply|null) => void
  ): UnaryResponse;
  getGrades(
    requestMessage: model_student_pb.StudentRequest,
    callback: (error: ServiceError|null, responseMessage: model_student_pb.GetGradesReply|null) => void
  ): UnaryResponse;
  submitSwapRequests(
    requestMessage: model_general_pb.SwapRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  submitSwapRequests(
    requestMessage: model_general_pb.SwapRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  chooseSection(
    requestMessage: model_student_pb.ChooseSectionRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_student_pb.ChooseSectionReply|null) => void
  ): UnaryResponse;
  chooseSection(
    requestMessage: model_student_pb.ChooseSectionRequest,
    callback: (error: ServiceError|null, responseMessage: model_student_pb.ChooseSectionReply|null) => void
  ): UnaryResponse;
}

