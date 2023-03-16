package utils

import (
	"math"

	"golang.org/x/exp/maps"
)

// Algorithm for assigning sections
// Capacity: map from unique times to a map from section id to capacity
// Availability: map from student id to a list of sections they are available for
// results: map from sections to list of studentIDs
// exceptions: list of studentIDs unassigned
func RunAllocationAlgorithm(capacity map[string]map[string]int, availability map[string][]string) (results map[string][]string, exceptions []string) {

	uniqueTimeCapacity := make(map[string]int)
	for time, sectionCapacity := range capacity {
		for _, capacity := range sectionCapacity {
			uniqueTimeCapacity[time] += capacity
		}
	}

	return runAllocationAlgorithm(uniqueTimeCapacity, availability)
}

func runAllocationAlgorithm(uniqueTimeCapacity map[string]int, availability map[string][]string) (results map[string][]string, exceptions []string) {

	section_network := makeFlowNetwork(uniqueTimeCapacity, availability)

	path, ok := findAugmentingPath(section_network, "source", "sink")
	for ok {
		for i := 0; i < len(path)-1; i++ {
			section_network[path[i]][path[i+1]] -= 1
			section_network[path[i+1]][path[i]] += 1
		}
		path, ok = findAugmentingPath(section_network, "source", "sink")
	}

	results = make(map[string][]string)

	exceptions = maps.Keys(availability)
	for section := range uniqueTimeCapacity {
		assigned_students := make([]string, 0)
		for student, capacity := range section_network[section] {
			if capacity == 1 && student != "sink" {
				assigned_students = append(assigned_students, student)

				// Remove the student from the list of exceptions
				// Swap the last element of the slice with the student and then pop it off
				for i, exception := range exceptions {
					if exception == student {
						exceptions[i] = exceptions[len(exceptions)-1]
						exceptions = exceptions[:len(exceptions)-1]
						break
					}
				}
			}
		}
		results[section] = assigned_students
	}

	return results, exceptions
}

// Handle the exception cases by adding students to the sections they are available for
func HandleExceptions(
	capacity map[string]map[string]int,
	availability map[string][]string,
	results map[string][]string,
	exceptions []string) (finalResults map[string][]string) {

	return results
}

// Given the results returned by algorithm, returns a map from sectionID to list of studentIDs
// If there is only one section for that time, all the students are in the section
// Otherwise, the students are assigned into sections based on the proportions of section capacity
// Results: map from time to a list of studentIDs
// Capacity: map from unique times to a map from section id to their capacity
func GetAssignedSections(results map[string][]string, capacity map[string]map[string]int) map[string][]string {
	finalResults := make(map[string][]string)
	for time, sections := range capacity {
		if len(sections) == 1 {
			for sectionID := range sections {
				finalResults[sectionID] = results[time]
			}
		} else {
			allocatedStudentAmount := len(results[time])

			totalCapacity := 0
			for _, sectionCapacity := range sections {
				totalCapacity += sectionCapacity
			}

			sectionToEnrollment := make(map[string]int)
			for sectionID, sectionCapacity := range sections {
				sectionToEnrollment[sectionID] = int(math.Floor(float64(allocatedStudentAmount) * float64(sectionCapacity) / float64(totalCapacity)))
			}

			runningSum := 0
			for sectionID, enrollmentAmt := range sectionToEnrollment {
				finalResults[sectionID] = results[time][runningSum : runningSum+enrollmentAmt]
				runningSum += enrollmentAmt
			}
		}
	}
	return finalResults
}

// -- Helpers --
func makeFlowNetwork(capacity map[string]int, availability map[string][]string) map[string]map[string]int {
	flow_network := make(map[string]map[string]int)
	flow_network["source"] = make(map[string]int)
	flow_network["sink"] = make(map[string]int)

	for section, cap := range capacity {
		flow_network[section] = make(map[string]int)
		flow_network[section]["sink"] = cap // The capacity of these edges is the capacity of the section
		flow_network["sink"][section] = 0   // The current flow through this edge is 0
	}

	for person, preferences := range availability {
		flow_network[person] = make(map[string]int)

		flow_network["source"][person] = 1 // The capacity of these edges is 1
		flow_network[person]["source"] = 0 // The current flow through this edge is 0

		for _, section := range preferences {
			flow_network[person][section] = 1 // This person can be assigned to this section once
			flow_network[section][person] = 0 // and isn't currently assigned to the section
		}
	}

	return flow_network
}

// Breadth-first search to find an augmenting path
// Returns the path and whether or not a path was found
func findAugmentingPath(flow_network map[string]map[string]int, source string, sink string) ([]string, bool) {
	visited := make(map[string]string)
	visited[source] = source

	queue := make([]string, 0)
	queue = append(queue, source)

	for len(queue) > 0 {
		node := queue[0]
		queue = queue[1:]

		for neighbor, capacity := range flow_network[node] {
			_, ok := visited[neighbor]
			if !ok && capacity > 0 {
				visited[neighbor] = node
				queue = append(queue, neighbor)
			}
		}
	}

	_, ok := visited[sink]
	if !ok {
		return nil, false
	}

	// Backtrack to find the path
	path := make([]string, 0)
	path = append(path, sink)

	for path[0] != source {
		path = append([]string{visited[path[0]]}, path...)
	}

	return path, true
}
