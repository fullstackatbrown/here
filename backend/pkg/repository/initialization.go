package repository

import (
	"context"
	"fmt"

	"sync"

	"cloud.google.com/go/firestore"
	"github.com/fullstackatbrown/here/pkg/firebase"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// createCollectionInitializer creates a snapshot iterator over the given collection, and when the
// collection changes, runs a function.
func (fr *FirebaseRepository) createCollectionInitializer(
	query firestore.Query, done *chan func(), handleDocs func(docs []*firestore.DocumentSnapshot) error) error {

	ctx, cancel := context.WithCancel(firebase.Context)
	defer cancel()
	it := query.Snapshots(ctx)
	var doOnce sync.Once

	for {
		select {
		case <-ctx.Done():
			return nil
		default:
			snap, err := it.Next()

			if err != nil {
				// DeadlineExceeded will be returned when ctx is cancelled.
				if status.Code(err) == codes.DeadlineExceeded || status.Code(err) == codes.Canceled {
					continue
				}
				return fmt.Errorf("Snapshots.Next: %v", err)
			}

			if snap == nil {
				continue
			}

			var docs []*firestore.DocumentSnapshot
			for {
				doc, err := snap.Documents.Next()

				// iterator.Done is returned when there are no more items to return
				if err == iterator.Done {
					break
				}

				if err != nil {
					return fmt.Errorf("Documents.Next: %v", err)
				}

				docs = append(docs, doc)
			}

			_ = handleDocs(docs)
			doOnce.Do(func() {
				*done <- cancel
			})
		}
	}
}
