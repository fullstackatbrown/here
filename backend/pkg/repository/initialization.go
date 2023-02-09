package repository

import (
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
	query firestore.Query, done *chan bool, handleDocs func(docs []*firestore.DocumentSnapshot) error) error {

	it := query.Snapshots(firebase.Context)
	var doOnce sync.Once

	for {
		snap, err := it.Next()

		// DeadlineExceeded will be returned when ctx is cancelled.
		if status.Code(err) == codes.DeadlineExceeded {
			return nil
		} else if err != nil {
			return fmt.Errorf("Snapshots.Next: %v", err)
		}

		// TODO: Determine why would this happen and handle accordingly
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
			*done <- true
		})
	}
}
