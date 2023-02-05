// package: here
// file: model/uta.proto

import * as model_uta_pb from "../model/uta_pb";
import * as model_general_pb from "../model/general_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import {grpc} from "@improbable-eng/grpc-web";

type UTACheckoff = {
  readonly methodName: string;
  readonly service: typeof UTA;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_uta_pb.CheckoffRequest;
  readonly responseType: typeof model_uta_pb.CheckoffReply;
};

type UTAAddGradeOption = {
  readonly methodName: string;
  readonly service: typeof UTA;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_general_pb.GradeOption;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type UTADeleteGradeOption = {
  readonly methodName: string;
  readonly service: typeof UTA;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_general_pb.GradeOption;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type UTAGetAllSwapRequests = {
  readonly methodName: string;
  readonly service: typeof UTA;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof google_protobuf_empty_pb.Empty;
  readonly responseType: typeof model_uta_pb.GetAllSwapRequestsReply;
};

type UTAHandleSwapRequests = {
  readonly methodName: string;
  readonly service: typeof UTA;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof model_uta_pb.HandleSwapRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

export class UTA {
  static readonly serviceName: string;
  static readonly Checkoff: UTACheckoff;
  static readonly AddGradeOption: UTAAddGradeOption;
  static readonly DeleteGradeOption: UTADeleteGradeOption;
  static readonly GetAllSwapRequests: UTAGetAllSwapRequests;
  static readonly HandleSwapRequests: UTAHandleSwapRequests;
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

export class UTAClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  checkoff(
    requestMessage: model_uta_pb.CheckoffRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_uta_pb.CheckoffReply|null) => void
  ): UnaryResponse;
  checkoff(
    requestMessage: model_uta_pb.CheckoffRequest,
    callback: (error: ServiceError|null, responseMessage: model_uta_pb.CheckoffReply|null) => void
  ): UnaryResponse;
  addGradeOption(
    requestMessage: model_general_pb.GradeOption,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  addGradeOption(
    requestMessage: model_general_pb.GradeOption,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  deleteGradeOption(
    requestMessage: model_general_pb.GradeOption,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  deleteGradeOption(
    requestMessage: model_general_pb.GradeOption,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  getAllSwapRequests(
    requestMessage: google_protobuf_empty_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: model_uta_pb.GetAllSwapRequestsReply|null) => void
  ): UnaryResponse;
  getAllSwapRequests(
    requestMessage: google_protobuf_empty_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: model_uta_pb.GetAllSwapRequestsReply|null) => void
  ): UnaryResponse;
  handleSwapRequests(
    requestMessage: model_uta_pb.HandleSwapRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  handleSwapRequests(
    requestMessage: model_uta_pb.HandleSwapRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
}

