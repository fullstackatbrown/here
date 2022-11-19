package main

import (
	"flag"
	"log"
	"net"

	pb "github.com/fullstackatbrown/here/pb"
	api "github.com/fullstackatbrown/here/pkg/api"
	"google.golang.org/grpc"
)

func main() {
	flag.Parse()
	listener, err := net.Listen("tcp", ":8000")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	adminAPI := &api.AdminAPI{}
	utaAPI := &api.UTAAPI{}
	studentAPI := &api.StudentAPI{}
	pb.RegisterAdminServer(s, adminAPI)
	pb.RegisterUTAServer(s, utaAPI)
	pb.RegisterStudentServer(s, studentAPI)
	log.Printf("server listening at %v", listener.Addr())
	if err := s.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}

}
