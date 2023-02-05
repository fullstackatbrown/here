// package: here
// file: model/student.proto

var model_student_pb = require("../model/student_pb");
var model_general_pb = require("../model/general_pb");
var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Student = (function () {
  function Student() {}
  Student.serviceName = "here.Student";
  return Student;
}());

Student.GetCourses = {
  methodName: "GetCourses",
  service: Student,
  requestStream: false,
  responseStream: false,
  requestType: model_student_pb.StudentRequest,
  responseType: model_student_pb.GetCoursesReply
};

Student.GetGrades = {
  methodName: "GetGrades",
  service: Student,
  requestStream: false,
  responseStream: false,
  requestType: model_student_pb.StudentRequest,
  responseType: model_student_pb.GetGradesReply
};

Student.SubmitSwapRequests = {
  methodName: "SubmitSwapRequests",
  service: Student,
  requestStream: false,
  responseStream: false,
  requestType: model_general_pb.SwapRequest,
  responseType: google_protobuf_empty_pb.Empty
};

Student.ChooseSection = {
  methodName: "ChooseSection",
  service: Student,
  requestStream: false,
  responseStream: false,
  requestType: model_student_pb.ChooseSectionRequest,
  responseType: model_student_pb.ChooseSectionReply
};

exports.Student = Student;

function StudentClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

StudentClient.prototype.getCourses = function getCourses(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Student.GetCourses, {
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

StudentClient.prototype.getGrades = function getGrades(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Student.GetGrades, {
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

StudentClient.prototype.submitSwapRequests = function submitSwapRequests(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Student.SubmitSwapRequests, {
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

StudentClient.prototype.chooseSection = function chooseSection(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Student.ChooseSection, {
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

exports.StudentClient = StudentClient;

