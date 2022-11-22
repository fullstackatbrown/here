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
proto.here = require('./admin_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.here.AdminClient =
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
proto.here.AdminPromiseClient =
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
 *   !proto.google.protobuf.Empty,
 *   !proto.here.GetAllSectionsReply>}
 */
const methodDescriptor_Admin_GetAllSections = new grpc.web.MethodDescriptor(
  '/here.Admin/GetAllSections',
  grpc.web.MethodType.UNARY,
  google_protobuf_empty_pb.Empty,
  proto.here.GetAllSectionsReply,
  /**
   * @param {!proto.google.protobuf.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.here.GetAllSectionsReply.deserializeBinary
);


/**
 * @param {!proto.google.protobuf.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.here.GetAllSectionsReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.here.GetAllSectionsReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.here.AdminClient.prototype.getAllSections =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/here.Admin/GetAllSections',
      request,
      metadata || {},
      methodDescriptor_Admin_GetAllSections,
      callback);
};


/**
 * @param {!proto.google.protobuf.Empty} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.here.GetAllSectionsReply>}
 *     Promise that resolves to the response
 */
proto.here.AdminPromiseClient.prototype.getAllSections =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/here.Admin/GetAllSections',
      request,
      metadata || {},
      methodDescriptor_Admin_GetAllSections);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Section,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_Admin_AddSection = new grpc.web.MethodDescriptor(
  '/here.Admin/AddSection',
  grpc.web.MethodType.UNARY,
  model_general_pb.Section,
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.Section} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @param {!proto.Section} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.here.AdminClient.prototype.addSection =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/here.Admin/AddSection',
      request,
      metadata || {},
      methodDescriptor_Admin_AddSection,
      callback);
};


/**
 * @param {!proto.Section} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     Promise that resolves to the response
 */
proto.here.AdminPromiseClient.prototype.addSection =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/here.Admin/AddSection',
      request,
      metadata || {},
      methodDescriptor_Admin_AddSection);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Section,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_Admin_EditSection = new grpc.web.MethodDescriptor(
  '/here.Admin/EditSection',
  grpc.web.MethodType.UNARY,
  model_general_pb.Section,
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.Section} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @param {!proto.Section} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.here.AdminClient.prototype.editSection =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/here.Admin/EditSection',
      request,
      metadata || {},
      methodDescriptor_Admin_EditSection,
      callback);
};


/**
 * @param {!proto.Section} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     Promise that resolves to the response
 */
proto.here.AdminPromiseClient.prototype.editSection =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/here.Admin/EditSection',
      request,
      metadata || {},
      methodDescriptor_Admin_EditSection);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Section,
 *   !proto.google.protobuf.Empty>}
 */
const methodDescriptor_Admin_DeleteSection = new grpc.web.MethodDescriptor(
  '/here.Admin/DeleteSection',
  grpc.web.MethodType.UNARY,
  model_general_pb.Section,
  google_protobuf_empty_pb.Empty,
  /**
   * @param {!proto.Section} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  google_protobuf_empty_pb.Empty.deserializeBinary
);


/**
 * @param {!proto.Section} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.google.protobuf.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.google.protobuf.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.here.AdminClient.prototype.deleteSection =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/here.Admin/DeleteSection',
      request,
      metadata || {},
      methodDescriptor_Admin_DeleteSection,
      callback);
};


/**
 * @param {!proto.Section} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.google.protobuf.Empty>}
 *     Promise that resolves to the response
 */
proto.here.AdminPromiseClient.prototype.deleteSection =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/here.Admin/DeleteSection',
      request,
      metadata || {},
      methodDescriptor_Admin_DeleteSection);
};


module.exports = proto.here;

