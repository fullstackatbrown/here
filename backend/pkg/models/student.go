package models

type Student struct {
	ID             string
	DefaultSection map[string]string
	ActualSection  map[string]map[string]string
}
