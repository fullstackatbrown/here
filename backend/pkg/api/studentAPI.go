package api

import (
	"context"

	"github.com/fullstackatbrown/here/pb"
	"google.golang.org/protobuf/types/known/emptypb"
)

type StudentAPI struct {
	pb.UnimplementedStudentServer
}

func (s *StudentAPI) SubmitSwapRequest(ctx context.Context, request *pb.SwapRequest) (*emptypb.Empty, error) {
	return nil, nil
}
