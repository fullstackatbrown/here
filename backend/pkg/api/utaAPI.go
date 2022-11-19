package api

import (
	"context"

	"github.com/fullstackatbrown/here/pb"
)

type UTAAPI struct {
	pb.UnimplementedUTAServer
}

func (s *UTAAPI) Checkoff(ctx context.Context, request *pb.CheckoffRequest) (*pb.CheckoffReply, error) {
	return &pb.CheckoffReply{Ok: "ok"}, nil
}
