/**
 * @fileoverview gRPC-Web generated client stub for here
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');


var model_general_pb = require('../model/general_pb.js')

var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js')
const proto = {};
proto.here = require('./student_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.here.StudentClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.here.StudentPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.here.StudentRequest,
 *   !proto.here.GetCoursesReply>}
 */
const methodDescriptor_Student_GetCourses = new grpc.web.MethodDescriptor(
  '/here.Student/GetCourses',
  grpc.web.MethodType.UNARY,
  proto.here.StudentRequest,
  proto.here.GetCoursesReply,
  /**
   * @param {!proto.here.StudentRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.here.GetCoursesReply.deserializeBinary
);


/**
 * @param {!proto.here.StudentRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.here.GetCoursesReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.here.GetCoursesReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.here.StudentClient.prototype.getCourses =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/here.Student/GetCourses',
      request,
      metadata || {},
      methodDescriptor_Student_GetCourses,
      callback);
};


/**
 * @param {!proto.here.StudentRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.here.GetCoursesReply>}
 *     Promise that resolves to the response
 */
proto.here.StudentPromiseClient.prototype.getCourses =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/here.Student/GetCourses',
      request,
      metadata || {},
      methodDescriptor_Student_GetCourses);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.here.StudentRequest,
 *   !proto.here.GetGradesReply>}
 */
const methodDescriptor_Student_GetGrades = new grpc.web.MethodDescriptor(
  '/here.Student/GetGrades',
  grpc.web.MethodType.UNARY,
  proto.here.StudentRequest,
  proto.here.GetGradesReply,
  /**
   * @param {!proto.here.StudentRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.here.GetGradesReply.deserializeBinary
);


/**
 * @param {!proto.here.StudentRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.here.GetGradesReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.here.GetGradesReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.here.StudentClient.prototype.getGrades =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/here.Student/GetGrades',
      request,
      metadata || {},
      methodDescriptor_Student_GetGrades,
      callback);
};


/**
 * @param {!proto.here.StudentRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.here.GetGradesReply>}
 *     Promise that resolves to the response
 */
proto.here.StudentPromiseClient.prototype.getGrades =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/here.Student/GetGrades',
      request,
      metadata || {},
      methodDescriptor_Student_GetGrades);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.SwapRequest,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_Student_SubmitSwapRequests = new grpc.web.MethodDescriptor(
  '/here.Student/SubmitSwapRequests',
  grpc.web.MethodType.UNARY,
  model_general_pb.SwapRequest,
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.SwapRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @param {!proto.SwapRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.here.StudentClient.prototype.submitSwapRequests =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/here.Student/SubmitSwapRequests',
      request,
      metadata || {},
      methodDescriptor_Student_SubmitSwapRequests,
      callback);
};


/**
 * @param {!proto.SwapRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     Promise that resolves to the response
 */
proto.here.StudentPromiseClient.prototype.submitSwapRequests =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/here.Student/SubmitSwapRequests',
      request,
      metadata || {},
      methodDescriptor_Student_SubmitSwapRequests);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.here.ChooseSectionRequest,
 *   !proto.here.ChooseSectionReply>}
 */
const methodDescriptor_Student_ChooseSection = new grpc.web.MethodDescriptor(
  '/here.Student/ChooseSection',
  grpc.web.MethodType.UNARY,
  proto.here.ChooseSectionRequest,
  proto.here.ChooseSectionReply,
  /**
   * @param {!proto.here.ChooseSectionRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.here.ChooseSectionReply.deserializeBinary
);


/**
 * @param {!proto.here.ChooseSectionRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.here.ChooseSectionReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.here.ChooseSectionReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.here.StudentClient.prototype.chooseSection =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/here.Student/ChooseSection',
      request,
      metadata || {},
      methodDescriptor_Student_ChooseSection,
      callback);
};


/**
 * @param {!proto.here.ChooseSectionRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.here.ChooseSectionReply>}
 *     Promise that resolves to the response
 */
proto.here.StudentPromiseClient.prototype.chooseSection =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/here.Student/ChooseSection',
      request,
      metadata || {},
      methodDescriptor_Student_ChooseSection);
};


module.exports = proto.here;

