// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.21.12
// source: model/admin.proto

package pb

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// AdminClient is the client API for Admin service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type AdminClient interface {
	GetAllSections(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*GetAllSectionsReply, error)
	CreateSection(ctx context.Context, in *Section, opts ...grpc.CallOption) (*emptypb.Empty, error)
	EditSection(ctx context.Context, in *Section, opts ...grpc.CallOption) (*emptypb.Empty, error)
	DeleteSection(ctx context.Context, in *Section, opts ...grpc.CallOption) (*emptypb.Empty, error)
}

type adminClient struct {
	cc grpc.ClientConnInterface
}

func NewAdminClient(cc grpc.ClientConnInterface) AdminClient {
	return &adminClient{cc}
}

func (c *adminClient) GetAllSections(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*GetAllSectionsReply, error) {
	out := new(GetAllSectionsReply)
	err := c.cc.Invoke(ctx, "/here.Admin/GetAllSections", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *adminClient) CreateSection(ctx context.Context, in *Section, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/here.Admin/CreateSection", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *adminClient) EditSection(ctx context.Context, in *Section, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/here.Admin/EditSection", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *adminClient) DeleteSection(ctx context.Context, in *Section, opts ...grpc.CallOption) (*emptypb.Empty, error) {
	out := new(emptypb.Empty)
	err := c.cc.Invoke(ctx, "/here.Admin/DeleteSection", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// AdminServer is the server API for Admin service.
// All implementations must embed UnimplementedAdminServer
// for forward compatibility
type AdminServer interface {
	GetAllSections(context.Context, *emptypb.Empty) (*GetAllSectionsReply, error)
	CreateSection(context.Context, *Section) (*emptypb.Empty, error)
	EditSection(context.Context, *Section) (*emptypb.Empty, error)
	DeleteSection(context.Context, *Section) (*emptypb.Empty, error)
	mustEmbedUnimplementedAdminServer()
}

// UnimplementedAdminServer must be embedded to have forward compatible implementations.
type UnimplementedAdminServer struct {
}

func (UnimplementedAdminServer) GetAllSections(context.Context, *emptypb.Empty) (*GetAllSectionsReply, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAllSections not implemented")
}
func (UnimplementedAdminServer) CreateSection(context.Context, *Section) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateSection not implemented")
}
func (UnimplementedAdminServer) EditSection(context.Context, *Section) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method EditSection not implemented")
}
func (UnimplementedAdminServer) DeleteSection(context.Context, *Section) (*emptypb.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method DeleteSection not implemented")
}
func (UnimplementedAdminServer) mustEmbedUnimplementedAdminServer() {}

// UnsafeAdminServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to AdminServer will
// result in compilation errors.
type UnsafeAdminServer interface {
	mustEmbedUnimplementedAdminServer()
}

func RegisterAdminServer(s grpc.ServiceRegistrar, srv AdminServer) {
	s.RegisterService(&Admin_ServiceDesc, srv)
}

func _Admin_GetAllSections_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(emptypb.Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AdminServer).GetAllSections(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/here.Admin/GetAllSections",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AdminServer).GetAllSections(ctx, req.(*emptypb.Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _Admin_CreateSection_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Section)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AdminServer).CreateSection(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/here.Admin/CreateSection",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AdminServer).CreateSection(ctx, req.(*Section))
	}
	return interceptor(ctx, in, info, handler)
}

func _Admin_EditSection_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Section)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AdminServer).EditSection(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/here.Admin/EditSection",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AdminServer).EditSection(ctx, req.(*Section))
	}
	return interceptor(ctx, in, info, handler)
}

func _Admin_DeleteSection_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Section)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AdminServer).DeleteSection(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/here.Admin/DeleteSection",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AdminServer).DeleteSection(ctx, req.(*Section))
	}
	return interceptor(ctx, in, info, handler)
}

// Admin_ServiceDesc is the grpc.ServiceDesc for Admin service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Admin_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "here.Admin",
	HandlerType: (*AdminServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetAllSections",
			Handler:    _Admin_GetAllSections_Handler,
		},
		{
			MethodName: "CreateSection",
			Handler:    _Admin_CreateSection_Handler,
		},
		{
			MethodName: "EditSection",
			Handler:    _Admin_EditSection_Handler,
		},
		{
			MethodName: "DeleteSection",
			Handler:    _Admin_DeleteSection_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "model/admin.proto",
}
