package api

import (
	"context"

	"github.com/fullstackatbrown/here/pb"
	"google.golang.org/protobuf/types/known/emptypb"
)

type AdminAPI struct {
	pb.UnimplementedAdminServer
}

func (s *AdminAPI) GetAllSections(ctx context.Context, request *emptypb.Empty) (*pb.GetAllSectionsReply, error) {
	newSection := &pb.Section{}
	return &pb.GetAllSectionsReply{Sections: []*pb.Section{newSection}}, nil
}
