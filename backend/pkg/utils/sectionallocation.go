package utils

import "golang.org/x/exp/maps"

func MakeFlowNetwork(capacity map[string]int, availability map[string][]string) map[string]map[string]int {
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
func FindAugmentingPath(flow_network map[string]map[string]int, source string, sink string) ([]string, bool) {
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

// Algorithm for assigning sections
// Capacity: map from sections to their capacity
// Availability: map from student id to a list of sections they are available for
func AssignSections(capacity map[string]int, availability map[string][]string) (results map[string][]string, exceptions []string) {
	section_network := MakeFlowNetwork(capacity, availability)

	path, ok := FindAugmentingPath(section_network, "source", "sink")
	for ok {
		for i := 0; i < len(path)-1; i++ {
			section_network[path[i]][path[i+1]] -= 1
			section_network[path[i+1]][path[i]] += 1
		}
		path, ok = FindAugmentingPath(section_network, "source", "sink")
	}

	results = make(map[string][]string)

	exceptions = maps.Keys(availability)
	for section := range capacity {
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
