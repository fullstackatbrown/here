// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1
// 	protoc        v3.21.12
// source: model/general.proto

package pb

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	timestamppb "google.golang.org/protobuf/types/known/timestamppb"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type Day int32

const (
	Day_SUNDAY    Day = 0
	Day_MONDAY    Day = 1
	Day_TUESDAY   Day = 2
	Day_WEDNESDAY Day = 3
	Day_THURSDAY  Day = 4
	Day_FRIDAY    Day = 5
	Day_SATURDAY  Day = 6
)

// Enum value maps for Day.
var (
	Day_name = map[int32]string{
		0: "SUNDAY",
		1: "MONDAY",
		2: "TUESDAY",
		3: "WEDNESDAY",
		4: "THURSDAY",
		5: "FRIDAY",
		6: "SATURDAY",
	}
	Day_value = map[string]int32{
		"SUNDAY":    0,
		"MONDAY":    1,
		"TUESDAY":   2,
		"WEDNESDAY": 3,
		"THURSDAY":  4,
		"FRIDAY":    5,
		"SATURDAY":  6,
	}
)

func (x Day) Enum() *Day {
	p := new(Day)
	*p = x
	return p
}

func (x Day) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (Day) Descriptor() protoreflect.EnumDescriptor {
	return file_model_general_proto_enumTypes[0].Descriptor()
}

func (Day) Type() protoreflect.EnumType {
	return &file_model_general_proto_enumTypes[0]
}

func (x Day) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use Day.Descriptor instead.
func (Day) EnumDescriptor() ([]byte, []int) {
	return file_model_general_proto_rawDescGZIP(), []int{0}
}

type Course struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Code         string         `protobuf:"bytes,1,opt,name=code,proto3" json:"code,omitempty"`
	Title        string         `protobuf:"bytes,2,opt,name=title,proto3" json:"title,omitempty"`
	Sections     []*Section     `protobuf:"bytes,3,rep,name=sections,proto3" json:"sections,omitempty"`
	Assignments  []*Assignment  `protobuf:"bytes,4,rep,name=assignments,proto3" json:"assignments,omitempty"`
	GradeOptions []*GradeOption `protobuf:"bytes,5,rep,name=gradeOptions,proto3" json:"gradeOptions,omitempty"`
	Students     []*Student     `protobuf:"bytes,6,rep,name=students,proto3" json:"students,omitempty"`
}

func (x *Course) Reset() {
	*x = Course{}
	if protoimpl.UnsafeEnabled {
		mi := &file_model_general_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Course) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Course) ProtoMessage() {}

func (x *Course) ProtoReflect() protoreflect.Message {
	mi := &file_model_general_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Course.ProtoReflect.Descriptor instead.
func (*Course) Descriptor() ([]byte, []int) {
	return file_model_general_proto_rawDescGZIP(), []int{0}
}

func (x *Course) GetCode() string {
	if x != nil {
		return x.Code
	}
	return ""
}

func (x *Course) GetTitle() string {
	if x != nil {
		return x.Title
	}
	return ""
}

func (x *Course) GetSections() []*Section {
	if x != nil {
		return x.Sections
	}
	return nil
}

func (x *Course) GetAssignments() []*Assignment {
	if x != nil {
		return x.Assignments
	}
	return nil
}

func (x *Course) GetGradeOptions() []*GradeOption {
	if x != nil {
		return x.GradeOptions
	}
	return nil
}

func (x *Course) GetStudents() []*Student {
	if x != nil {
		return x.Students
	}
	return nil
}

type Section struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Id         string   `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Day        Day      `protobuf:"varint,2,opt,name=day,proto3,enum=Day" json:"day,omitempty"`
	StartTime  string   `protobuf:"bytes,3,opt,name=startTime,proto3" json:"startTime,omitempty"`
	EndTime    string   `protobuf:"bytes,4,opt,name=endTime,proto3" json:"endTime,omitempty"`
	Location   string   `protobuf:"bytes,5,opt,name=location,proto3" json:"location,omitempty"`
	Capacity   int32    `protobuf:"varint,6,opt,name=capacity,proto3" json:"capacity,omitempty"`
	Enrollment int32    `protobuf:"varint,7,opt,name=enrollment,proto3" json:"enrollment,omitempty"`
	Students   []string `protobuf:"bytes,8,rep,name=students,proto3" json:"students,omitempty"` // student id
}

func (x *Section) Reset() {
	*x = Section{}
	if protoimpl.UnsafeEnabled {
		mi := &file_model_general_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Section) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Section) ProtoMessage() {}

func (x *Section) ProtoReflect() protoreflect.Message {
	mi := &file_model_general_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Section.ProtoReflect.Descriptor instead.
func (*Section) Descriptor() ([]byte, []int) {
	return file_model_general_proto_rawDescGZIP(), []int{1}
}

func (x *Section) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *Section) GetDay() Day {
	if x != nil {
		return x.Day
	}
	return Day_SUNDAY
}

func (x *Section) GetStartTime() string {
	if x != nil {
		return x.StartTime
	}
	return ""
}

func (x *Section) GetEndTime() string {
	if x != nil {
		return x.EndTime
	}
	return ""
}

func (x *Section) GetLocation() string {
	if x != nil {
		return x.Location
	}
	return ""
}

func (x *Section) GetCapacity() int32 {
	if x != nil {
		return x.Capacity
	}
	return 0
}

func (x *Section) GetEnrollment() int32 {
	if x != nil {
		return x.Enrollment
	}
	return 0
}

func (x *Section) GetStudents() []string {
	if x != nil {
		return x.Students
	}
	return nil
}

type Assignment struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Name      string `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	Mandatory bool   `protobuf:"varint,2,opt,name=mandatory,proto3" json:"mandatory,omitempty"`
	StartDate string `protobuf:"bytes,3,opt,name=startDate,proto3" json:"startDate,omitempty"`
	EndDate   string `protobuf:"bytes,4,opt,name=endDate,proto3" json:"endDate,omitempty"`
}

func (x *Assignment) Reset() {
	*x = Assignment{}
	if protoimpl.UnsafeEnabled {
		mi := &file_model_general_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Assignment) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Assignment) ProtoMessage() {}

func (x *Assignment) ProtoReflect() protoreflect.Message {
	mi := &file_model_general_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Assignment.ProtoReflect.Descriptor instead.
func (*Assignment) Descriptor() ([]byte, []int) {
	return file_model_general_proto_rawDescGZIP(), []int{2}
}

func (x *Assignment) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *Assignment) GetMandatory() bool {
	if x != nil {
		return x.Mandatory
	}
	return false
}

func (x *Assignment) GetStartDate() string {
	if x != nil {
		return x.StartDate
	}
	return ""
}

func (x *Assignment) GetEndDate() string {
	if x != nil {
		return x.EndDate
	}
	return ""
}

type Student struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Id      string            `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Section string            `protobuf:"bytes,2,opt,name=section,proto3" json:"section,omitempty"`                                                                                       // section id
	Grades  map[string]string `protobuf:"bytes,3,rep,name=grades,proto3" json:"grades,omitempty" protobuf_key:"bytes,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"` // map from assignment name to grade option
}

func (x *Student) Reset() {
	*x = Student{}
	if protoimpl.UnsafeEnabled {
		mi := &file_model_general_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Student) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Student) ProtoMessage() {}

func (x *Student) ProtoReflect() protoreflect.Message {
	mi := &file_model_general_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Student.ProtoReflect.Descriptor instead.
func (*Student) Descriptor() ([]byte, []int) {
	return file_model_general_proto_rawDescGZIP(), []int{3}
}

func (x *Student) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *Student) GetSection() string {
	if x != nil {
		return x.Section
	}
	return ""
}

func (x *Student) GetGrades() map[string]string {
	if x != nil {
		return x.Grades
	}
	return nil
}

type GradeOption struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	GradeOption string `protobuf:"bytes,1,opt,name=gradeOption,proto3" json:"gradeOption,omitempty"`
}

func (x *GradeOption) Reset() {
	*x = GradeOption{}
	if protoimpl.UnsafeEnabled {
		mi := &file_model_general_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *GradeOption) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*GradeOption) ProtoMessage() {}

func (x *GradeOption) ProtoReflect() protoreflect.Message {
	mi := &file_model_general_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use GradeOption.ProtoReflect.Descriptor instead.
func (*GradeOption) Descriptor() ([]byte, []int) {
	return file_model_general_proto_rawDescGZIP(), []int{4}
}

func (x *GradeOption) GetGradeOption() string {
	if x != nil {
		return x.GradeOption
	}
	return ""
}

type SwapRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	StudentId   string                 `protobuf:"bytes,1,opt,name=studentId,proto3" json:"studentId,omitempty"`
	From        string                 `protobuf:"bytes,2,opt,name=from,proto3" json:"from,omitempty"`
	To          string                 `protobuf:"bytes,3,opt,name=to,proto3" json:"to,omitempty"`
	Reason      string                 `protobuf:"bytes,4,opt,name=reason,proto3" json:"reason,omitempty"`
	RequestTime *timestamppb.Timestamp `protobuf:"bytes,5,opt,name=requestTime,proto3" json:"requestTime,omitempty"`
}

func (x *SwapRequest) Reset() {
	*x = SwapRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_model_general_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *SwapRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*SwapRequest) ProtoMessage() {}

func (x *SwapRequest) ProtoReflect() protoreflect.Message {
	mi := &file_model_general_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use SwapRequest.ProtoReflect.Descriptor instead.
func (*SwapRequest) Descriptor() ([]byte, []int) {
	return file_model_general_proto_rawDescGZIP(), []int{5}
}

func (x *SwapRequest) GetStudentId() string {
	if x != nil {
		return x.StudentId
	}
	return ""
}

func (x *SwapRequest) GetFrom() string {
	if x != nil {
		return x.From
	}
	return ""
}

func (x *SwapRequest) GetTo() string {
	if x != nil {
		return x.To
	}
	return ""
}

func (x *SwapRequest) GetReason() string {
	if x != nil {
		return x.Reason
	}
	return ""
}

func (x *SwapRequest) GetRequestTime() *timestamppb.Timestamp {
	if x != nil {
		return x.RequestTime
	}
	return nil
}

var File_model_general_proto protoreflect.FileDescriptor

var file_model_general_proto_rawDesc = []byte{
	0x0a, 0x13, 0x6d, 0x6f, 0x64, 0x65, 0x6c, 0x2f, 0x67, 0x65, 0x6e, 0x65, 0x72, 0x61, 0x6c, 0x2e,
	0x70, 0x72, 0x6f, 0x74, 0x6f, 0x1a, 0x1f, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2f, 0x74, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70,
	0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0xdf, 0x01, 0x0a, 0x06, 0x43, 0x6f, 0x75, 0x72, 0x73,
	0x65, 0x12, 0x12, 0x0a, 0x04, 0x63, 0x6f, 0x64, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x04, 0x63, 0x6f, 0x64, 0x65, 0x12, 0x14, 0x0a, 0x05, 0x74, 0x69, 0x74, 0x6c, 0x65, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x74, 0x69, 0x74, 0x6c, 0x65, 0x12, 0x24, 0x0a, 0x08, 0x73,
	0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x73, 0x18, 0x03, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x08, 0x2e,
	0x53, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x52, 0x08, 0x73, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e,
	0x73, 0x12, 0x2d, 0x0a, 0x0b, 0x61, 0x73, 0x73, 0x69, 0x67, 0x6e, 0x6d, 0x65, 0x6e, 0x74, 0x73,
	0x18, 0x04, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x0b, 0x2e, 0x41, 0x73, 0x73, 0x69, 0x67, 0x6e, 0x6d,
	0x65, 0x6e, 0x74, 0x52, 0x0b, 0x61, 0x73, 0x73, 0x69, 0x67, 0x6e, 0x6d, 0x65, 0x6e, 0x74, 0x73,
	0x12, 0x30, 0x0a, 0x0c, 0x67, 0x72, 0x61, 0x64, 0x65, 0x4f, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x73,
	0x18, 0x05, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x0c, 0x2e, 0x47, 0x72, 0x61, 0x64, 0x65, 0x4f, 0x70,
	0x74, 0x69, 0x6f, 0x6e, 0x52, 0x0c, 0x67, 0x72, 0x61, 0x64, 0x65, 0x4f, 0x70, 0x74, 0x69, 0x6f,
	0x6e, 0x73, 0x12, 0x24, 0x0a, 0x08, 0x73, 0x74, 0x75, 0x64, 0x65, 0x6e, 0x74, 0x73, 0x18, 0x06,
	0x20, 0x03, 0x28, 0x0b, 0x32, 0x08, 0x2e, 0x53, 0x74, 0x75, 0x64, 0x65, 0x6e, 0x74, 0x52, 0x08,
	0x73, 0x74, 0x75, 0x64, 0x65, 0x6e, 0x74, 0x73, 0x22, 0xdd, 0x01, 0x0a, 0x07, 0x53, 0x65, 0x63,
	0x74, 0x69, 0x6f, 0x6e, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x02, 0x69, 0x64, 0x12, 0x16, 0x0a, 0x03, 0x64, 0x61, 0x79, 0x18, 0x02, 0x20, 0x01, 0x28,
	0x0e, 0x32, 0x04, 0x2e, 0x44, 0x61, 0x79, 0x52, 0x03, 0x64, 0x61, 0x79, 0x12, 0x1c, 0x0a, 0x09,
	0x73, 0x74, 0x61, 0x72, 0x74, 0x54, 0x69, 0x6d, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x09, 0x73, 0x74, 0x61, 0x72, 0x74, 0x54, 0x69, 0x6d, 0x65, 0x12, 0x18, 0x0a, 0x07, 0x65, 0x6e,
	0x64, 0x54, 0x69, 0x6d, 0x65, 0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x65, 0x6e, 0x64,
	0x54, 0x69, 0x6d, 0x65, 0x12, 0x1a, 0x0a, 0x08, 0x6c, 0x6f, 0x63, 0x61, 0x74, 0x69, 0x6f, 0x6e,
	0x18, 0x05, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x6c, 0x6f, 0x63, 0x61, 0x74, 0x69, 0x6f, 0x6e,
	0x12, 0x1a, 0x0a, 0x08, 0x63, 0x61, 0x70, 0x61, 0x63, 0x69, 0x74, 0x79, 0x18, 0x06, 0x20, 0x01,
	0x28, 0x05, 0x52, 0x08, 0x63, 0x61, 0x70, 0x61, 0x63, 0x69, 0x74, 0x79, 0x12, 0x1e, 0x0a, 0x0a,
	0x65, 0x6e, 0x72, 0x6f, 0x6c, 0x6c, 0x6d, 0x65, 0x6e, 0x74, 0x18, 0x07, 0x20, 0x01, 0x28, 0x05,
	0x52, 0x0a, 0x65, 0x6e, 0x72, 0x6f, 0x6c, 0x6c, 0x6d, 0x65, 0x6e, 0x74, 0x12, 0x1a, 0x0a, 0x08,
	0x73, 0x74, 0x75, 0x64, 0x65, 0x6e, 0x74, 0x73, 0x18, 0x08, 0x20, 0x03, 0x28, 0x09, 0x52, 0x08,
	0x73, 0x74, 0x75, 0x64, 0x65, 0x6e, 0x74, 0x73, 0x22, 0x76, 0x0a, 0x0a, 0x41, 0x73, 0x73, 0x69,
	0x67, 0x6e, 0x6d, 0x65, 0x6e, 0x74, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x01,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x1c, 0x0a, 0x09, 0x6d, 0x61,
	0x6e, 0x64, 0x61, 0x74, 0x6f, 0x72, 0x79, 0x18, 0x02, 0x20, 0x01, 0x28, 0x08, 0x52, 0x09, 0x6d,
	0x61, 0x6e, 0x64, 0x61, 0x74, 0x6f, 0x72, 0x79, 0x12, 0x1c, 0x0a, 0x09, 0x73, 0x74, 0x61, 0x72,
	0x74, 0x44, 0x61, 0x74, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x73, 0x74, 0x61,
	0x72, 0x74, 0x44, 0x61, 0x74, 0x65, 0x12, 0x18, 0x0a, 0x07, 0x65, 0x6e, 0x64, 0x44, 0x61, 0x74,
	0x65, 0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x65, 0x6e, 0x64, 0x44, 0x61, 0x74, 0x65,
	0x22, 0x9c, 0x01, 0x0a, 0x07, 0x53, 0x74, 0x75, 0x64, 0x65, 0x6e, 0x74, 0x12, 0x0e, 0x0a, 0x02,
	0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x12, 0x18, 0x0a, 0x07,
	0x73, 0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x73,
	0x65, 0x63, 0x74, 0x69, 0x6f, 0x6e, 0x12, 0x2c, 0x0a, 0x06, 0x67, 0x72, 0x61, 0x64, 0x65, 0x73,
	0x18, 0x03, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x14, 0x2e, 0x53, 0x74, 0x75, 0x64, 0x65, 0x6e, 0x74,
	0x2e, 0x47, 0x72, 0x61, 0x64, 0x65, 0x73, 0x45, 0x6e, 0x74, 0x72, 0x79, 0x52, 0x06, 0x67, 0x72,
	0x61, 0x64, 0x65, 0x73, 0x1a, 0x39, 0x0a, 0x0b, 0x47, 0x72, 0x61, 0x64, 0x65, 0x73, 0x45, 0x6e,
	0x74, 0x72, 0x79, 0x12, 0x10, 0x0a, 0x03, 0x6b, 0x65, 0x79, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x03, 0x6b, 0x65, 0x79, 0x12, 0x14, 0x0a, 0x05, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x05, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x3a, 0x02, 0x38, 0x01, 0x22,
	0x2f, 0x0a, 0x0b, 0x47, 0x72, 0x61, 0x64, 0x65, 0x4f, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x12, 0x20,
	0x0a, 0x0b, 0x67, 0x72, 0x61, 0x64, 0x65, 0x4f, 0x70, 0x74, 0x69, 0x6f, 0x6e, 0x18, 0x01, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x0b, 0x67, 0x72, 0x61, 0x64, 0x65, 0x4f, 0x70, 0x74, 0x69, 0x6f, 0x6e,
	0x22, 0xa5, 0x01, 0x0a, 0x0b, 0x53, 0x77, 0x61, 0x70, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x12, 0x1c, 0x0a, 0x09, 0x73, 0x74, 0x75, 0x64, 0x65, 0x6e, 0x74, 0x49, 0x64, 0x18, 0x01, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x09, 0x73, 0x74, 0x75, 0x64, 0x65, 0x6e, 0x74, 0x49, 0x64, 0x12, 0x12,
	0x0a, 0x04, 0x66, 0x72, 0x6f, 0x6d, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x66, 0x72,
	0x6f, 0x6d, 0x12, 0x0e, 0x0a, 0x02, 0x74, 0x6f, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02,
	0x74, 0x6f, 0x12, 0x16, 0x0a, 0x06, 0x72, 0x65, 0x61, 0x73, 0x6f, 0x6e, 0x18, 0x04, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x06, 0x72, 0x65, 0x61, 0x73, 0x6f, 0x6e, 0x12, 0x3c, 0x0a, 0x0b, 0x72, 0x65,
	0x71, 0x75, 0x65, 0x73, 0x74, 0x54, 0x69, 0x6d, 0x65, 0x18, 0x05, 0x20, 0x01, 0x28, 0x0b, 0x32,
	0x1a, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75,
	0x66, 0x2e, 0x54, 0x69, 0x6d, 0x65, 0x73, 0x74, 0x61, 0x6d, 0x70, 0x52, 0x0b, 0x72, 0x65, 0x71,
	0x75, 0x65, 0x73, 0x74, 0x54, 0x69, 0x6d, 0x65, 0x2a, 0x61, 0x0a, 0x03, 0x44, 0x61, 0x79, 0x12,
	0x0a, 0x0a, 0x06, 0x53, 0x55, 0x4e, 0x44, 0x41, 0x59, 0x10, 0x00, 0x12, 0x0a, 0x0a, 0x06, 0x4d,
	0x4f, 0x4e, 0x44, 0x41, 0x59, 0x10, 0x01, 0x12, 0x0b, 0x0a, 0x07, 0x54, 0x55, 0x45, 0x53, 0x44,
	0x41, 0x59, 0x10, 0x02, 0x12, 0x0d, 0x0a, 0x09, 0x57, 0x45, 0x44, 0x4e, 0x45, 0x53, 0x44, 0x41,
	0x59, 0x10, 0x03, 0x12, 0x0c, 0x0a, 0x08, 0x54, 0x48, 0x55, 0x52, 0x53, 0x44, 0x41, 0x59, 0x10,
	0x04, 0x12, 0x0a, 0x0a, 0x06, 0x46, 0x52, 0x49, 0x44, 0x41, 0x59, 0x10, 0x05, 0x12, 0x0c, 0x0a,
	0x08, 0x53, 0x41, 0x54, 0x55, 0x52, 0x44, 0x41, 0x59, 0x10, 0x06, 0x42, 0x0c, 0x5a, 0x0a, 0x62,
	0x61, 0x63, 0x6b, 0x65, 0x6e, 0x64, 0x2f, 0x70, 0x62, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f,
	0x33,
}

var (
	file_model_general_proto_rawDescOnce sync.Once
	file_model_general_proto_rawDescData = file_model_general_proto_rawDesc
)

func file_model_general_proto_rawDescGZIP() []byte {
	file_model_general_proto_rawDescOnce.Do(func() {
		file_model_general_proto_rawDescData = protoimpl.X.CompressGZIP(file_model_general_proto_rawDescData)
	})
	return file_model_general_proto_rawDescData
}

var file_model_general_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_model_general_proto_msgTypes = make([]protoimpl.MessageInfo, 7)
var file_model_general_proto_goTypes = []interface{}{
	(Day)(0),                      // 0: Day
	(*Course)(nil),                // 1: Course
	(*Section)(nil),               // 2: Section
	(*Assignment)(nil),            // 3: Assignment
	(*Student)(nil),               // 4: Student
	(*GradeOption)(nil),           // 5: GradeOption
	(*SwapRequest)(nil),           // 6: SwapRequest
	nil,                           // 7: Student.GradesEntry
	(*timestamppb.Timestamp)(nil), // 8: google.protobuf.Timestamp
}
var file_model_general_proto_depIdxs = []int32{
	2, // 0: Course.sections:type_name -> Section
	3, // 1: Course.assignments:type_name -> Assignment
	5, // 2: Course.gradeOptions:type_name -> GradeOption
	4, // 3: Course.students:type_name -> Student
	0, // 4: Section.day:type_name -> Day
	7, // 5: Student.grades:type_name -> Student.GradesEntry
	8, // 6: SwapRequest.requestTime:type_name -> google.protobuf.Timestamp
	7, // [7:7] is the sub-list for method output_type
	7, // [7:7] is the sub-list for method input_type
	7, // [7:7] is the sub-list for extension type_name
	7, // [7:7] is the sub-list for extension extendee
	0, // [0:7] is the sub-list for field type_name
}

func init() { file_model_general_proto_init() }
func file_model_general_proto_init() {
	if File_model_general_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_model_general_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Course); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_model_general_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Section); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_model_general_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Assignment); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_model_general_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Student); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_model_general_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*GradeOption); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_model_general_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*SwapRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_model_general_proto_rawDesc,
			NumEnums:      1,
			NumMessages:   7,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_model_general_proto_goTypes,
		DependencyIndexes: file_model_general_proto_depIdxs,
		EnumInfos:         file_model_general_proto_enumTypes,
		MessageInfos:      file_model_general_proto_msgTypes,
	}.Build()
	File_model_general_proto = out.File
	file_model_general_proto_rawDesc = nil
	file_model_general_proto_goTypes = nil
	file_model_general_proto_depIdxs = nil
}
