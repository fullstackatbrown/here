package utils

import (
	"testing"

	"github.com/google/go-cmp/cmp"
)

func TestSimpleAllocation(t *testing.T) {
	capacity := map[string]int{
		"L1": 1,
		"L2": 1,
		"L3": 1,
		"L4": 1,
		"L5": 1,
	}

	availability := map[string][]string{
		"A": {"L1"},
		"B": {"L2"},
		"C": {"L3"},
		"D": {"L4"},
		"E": {"L5"},
	}

	allocated_got, missing_got := AssignSections(capacity, availability)

	allocated_want := map[string][]string{
		"L1": {"A"},
		"L2": {"B"},
		"L3": {"C"},
		"L4": {"D"},
		"L5": {"E"},
	}

	missing_want := []string{}

	if !cmp.Equal(allocated_got, allocated_want) {
		t.Errorf("got %q, wanted %q", allocated_got, allocated_want)
	}

	if !cmp.Equal(missing_got, missing_want) {
		t.Errorf("got %q, wanted %q", missing_got, missing_want)
	}
}
