// package: here
// file: model/admin.proto

import * as model_admin_pb from "../model/admin_pb";
import * as model_general_pb from "../model/general_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import {grpc} from "@improbable-eng/grpc-web";

type AdminGetAllSections = {
  readonly methodName: string;
  readonly service: typeof Admin;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof google_protobuf_empty_pb.Empty;
  readonly responseType: typeof model_admin_pb.GetAllSectionsReply;
};

type AdminCreateSection = {
  readonly methodName: string;
  readonly service: typeof Admin;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_general_pb.Section;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type AdminEditSection = {
  readonly methodName: string;
  readonly service: typeof Admin;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_general_pb.Section;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type AdminDeleteSection = {
  readonly methodName: string;
  readonly service: typeof Admin;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_general_pb.Section;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

export class Admin {
  static readonly serviceName: string;
  static readonly GetAllSections: AdminGetAllSections;
  static readonly CreateSection: AdminCreateSection;
  static readonly EditSection: AdminEditSection;
  static readonly DeleteSection: AdminDeleteSection;
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

export class AdminClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getAllSections(
    requestMessage: google_protobuf_empty_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_admin_pb.GetAllSectionsReply|null) => void
  ): UnaryResponse;
  getAllSections(
    requestMessage: google_protobuf_empty_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: model_admin_pb.GetAllSectionsReply|null) => void
  ): UnaryResponse;
  createSection(
    requestMessage: model_general_pb.Section,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  createSection(
    requestMessage: model_general_pb.Section,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  editSection(
    requestMessage: model_general_pb.Section,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  editSection(
    requestMessage: model_general_pb.Section,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  deleteSection(
    requestMessage: model_general_pb.Section,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  deleteSection(
    requestMessage: model_general_pb.Section,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
}

