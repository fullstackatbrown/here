// package: here
// file: model/uta.proto

var model_uta_pb = require("../model/uta_pb");
var model_general_pb = require("../model/general_pb");
var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var UTA = (function () {
  function UTA() {}
  UTA.serviceName = "here.UTA";
  return UTA;
}());

UTA.Checkoff = {
  methodName: "Checkoff",
  service: UTA,
  requestStream: false,
  responseStream: false,
  requestType: model_uta_pb.CheckoffRequest,
  responseType: model_uta_pb.CheckoffReply
};

UTA.AddGradeOption = {
  methodName: "AddGradeOption",
  service: UTA,
  requestStream: false,
  responseStream: false,
  requestType: model_general_pb.GradeOption,
  responseType: google_protobuf_empty_pb.Empty
};

UTA.DeleteGradeOption = {
  methodName: "DeleteGradeOption",
  service: UTA,
  requestStream: false,
  responseStream: false,
  requestType: model_general_pb.GradeOption,
  responseType: google_protobuf_empty_pb.Empty
};

UTA.GetAllSwapRequests = {
  methodName: "GetAllSwapRequests",
  service: UTA,
  requestStream: false,
  responseStream: false,
  requestType: google_protobuf_empty_pb.Empty,
  responseType: model_uta_pb.GetAllSwapRequestsReply
};

UTA.HandleSwapRequests = {
  methodName: "HandleSwapRequests",
  service: UTA,
  requestStream: false,
  responseStream: false,
  requestType: model_uta_pb.HandleSwapRequest,
  responseType: google_protobuf_empty_pb.Empty
};

exports.UTA = UTA;

function UTAClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

UTAClient.prototype.checkoff = function checkoff(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(UTA.Checkoff, {
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

UTAClient.prototype.addGradeOption = function addGradeOption(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(UTA.AddGradeOption, {
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

UTAClient.prototype.deleteGradeOption = function deleteGradeOption(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(UTA.DeleteGradeOption, {
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

UTAClient.prototype.getAllSwapRequests = function getAllSwapRequests(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(UTA.GetAllSwapRequests, {
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

UTAClient.prototype.handleSwapRequests = function handleSwapRequests(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(UTA.HandleSwapRequests, {
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

exports.UTAClient = UTAClient;

