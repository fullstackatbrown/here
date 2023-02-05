// package: here
// file: model/admin.proto

var model_admin_pb = require("../model/admin_pb");
var model_general_pb = require("../model/general_pb");
var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Admin = (function () {
  function Admin() {}
  Admin.serviceName = "here.Admin";
  return Admin;
}());

Admin.GetAllSections = {
  methodName: "GetAllSections",
  service: Admin,
  requestStream: false,
  responseStream: false,
  requestType: google_protobuf_empty_pb.Empty,
  responseType: model_admin_pb.GetAllSectionsReply
};

Admin.CreateSection = {
  methodName: "CreateSection",
  service: Admin,
  requestStream: false,
  responseStream: false,
  requestType: model_general_pb.Section,
  responseType: google_protobuf_empty_pb.Empty
};

Admin.EditSection = {
  methodName: "EditSection",
  service: Admin,
  requestStream: false,
  responseStream: false,
  requestType: model_general_pb.Section,
  responseType: google_protobuf_empty_pb.Empty
};

Admin.DeleteSection = {
  methodName: "DeleteSection",
  service: Admin,
  requestStream: false,
  responseStream: false,
  requestType: model_general_pb.Section,
  responseType: google_protobuf_empty_pb.Empty
};

exports.Admin = Admin;

function AdminClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

AdminClient.prototype.getAllSections = function getAllSections(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Admin.GetAllSections, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AdminClient.prototype.createSection = function createSection(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Admin.CreateSection, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AdminClient.prototype.editSection = function editSection(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Admin.EditSection, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AdminClient.prototype.deleteSection = function deleteSection(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Admin.DeleteSection, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.AdminClient = AdminClient;

