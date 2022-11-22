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
proto.here = require('./uta_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.here.UTAClient =
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
proto.here.UTAPromiseClient =
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
 *   !proto.here.CheckoffRequest,
 *   !proto.here.CheckoffReply>}
 */
const methodDescriptor_UTA_Checkoff = new grpc.web.MethodDescriptor(
  '/here.UTA/Checkoff',
  grpc.web.MethodType.UNARY,
  proto.here.CheckoffRequest,
  proto.here.CheckoffReply,
  /**
   * @param {!proto.here.CheckoffRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.here.CheckoffReply.deserializeBinary
);


/**
 * @param {!proto.here.CheckoffRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.here.CheckoffReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.here.CheckoffReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.here.UTAClient.prototype.checkoff =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/here.UTA/Checkoff',
      request,
      metadata || {},
      methodDescriptor_UTA_Checkoff,
      callback);
};


/**
 * @param {!proto.here.CheckoffRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.here.CheckoffReply>}
 *     Promise that resolves to the response
 */
proto.here.UTAPromiseClient.prototype.checkoff =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/here.UTA/Checkoff',
      request,
      metadata || {},
      methodDescriptor_UTA_Checkoff);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.GradeOption,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_UTA_AddGradeOption = new grpc.web.MethodDescriptor(
  '/here.UTA/AddGradeOption',
  grpc.web.MethodType.UNARY,
  model_general_pb.GradeOption,
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.GradeOption} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @param {!proto.GradeOption} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.here.UTAClient.prototype.addGradeOption =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/here.UTA/AddGradeOption',
      request,
      metadata || {},
      methodDescriptor_UTA_AddGradeOption,
      callback);
};


/**
 * @param {!proto.GradeOption} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     Promise that resolves to the response
 */
proto.here.UTAPromiseClient.prototype.addGradeOption =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/here.UTA/AddGradeOption',
      request,
      metadata || {},
      methodDescriptor_UTA_AddGradeOption);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.GradeOption,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_UTA_DeleteGradeOption = new grpc.web.MethodDescriptor(
  '/here.UTA/DeleteGradeOption',
  grpc.web.MethodType.UNARY,
  model_general_pb.GradeOption,
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.GradeOption} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @param {!proto.GradeOption} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.here.UTAClient.prototype.deleteGradeOption =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/here.UTA/DeleteGradeOption',
      request,
      metadata || {},
      methodDescriptor_UTA_DeleteGradeOption,
      callback);
};


/**
 * @param {!proto.GradeOption} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     Promise that resolves to the response
 */
proto.here.UTAPromiseClient.prototype.deleteGradeOption =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/here.UTA/DeleteGradeOption',
      request,
      metadata || {},
      methodDescriptor_UTA_DeleteGradeOption);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.google.protobuf.Empty,
 *   !proto.here.GetAllSwapRequestsReply>}
 */
const methodDescriptor_UTA_GetAllSwapRequests = new grpc.web.MethodDescriptor(
  '/here.UTA/GetAllSwapRequests',
  grpc.web.MethodType.UNARY,
  google_protobuf_empty_pb.Empty,
  proto.here.GetAllSwapRequestsReply,
  /**
   * @param {!proto.google.protobuf.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.here.GetAllSwapRequestsReply.deserializeBinary
);


/**
 * @param {!proto.google.protobuf.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.here.GetAllSwapRequestsReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.here.GetAllSwapRequestsReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.here.UTAClient.prototype.getAllSwapRequests =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/here.UTA/GetAllSwapRequests',
      request,
      metadata || {},
      methodDescriptor_UTA_GetAllSwapRequests,
      callback);
};


/**
 * @param {!proto.google.protobuf.Empty} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.here.GetAllSwapRequestsReply>}
 *     Promise that resolves to the response
 */
proto.here.UTAPromiseClient.prototype.getAllSwapRequests =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/here.UTA/GetAllSwapRequests',
      request,
      metadata || {},
      methodDescriptor_UTA_GetAllSwapRequests);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.here.HandleSwapRequest,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_UTA_HandleSwapRequests = new grpc.web.MethodDescriptor(
  '/here.UTA/HandleSwapRequests',
  grpc.web.MethodType.UNARY,
  proto.here.HandleSwapRequest,
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.here.HandleSwapRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @param {!proto.here.HandleSwapRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.here.UTAClient.prototype.handleSwapRequests =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/here.UTA/HandleSwapRequests',
      request,
      metadata || {},
      methodDescriptor_UTA_HandleSwapRequests,
      callback);
};


/**
 * @param {!proto.here.HandleSwapRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     Promise that resolves to the response
 */
proto.here.UTAPromiseClient.prototype.handleSwapRequests =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/here.UTA/HandleSwapRequests',
      request,
      metadata || {},
      methodDescriptor_UTA_HandleSwapRequests);
};


module.exports = proto.here;

