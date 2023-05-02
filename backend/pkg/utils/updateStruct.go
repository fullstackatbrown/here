package utils

import (
	"fmt"
	"reflect"
)

func UpdateStruct(s interface{}, newS interface{}, fieldsToExclude []string) error {
	// Ensure that both s and newS are pointers to structs
	sVal := reflect.ValueOf(s)
	if sVal.Kind() != reflect.Ptr || sVal.Elem().Kind() != reflect.Struct {
		return fmt.Errorf("s must be a pointer to a struct")
	}
	newSVal := reflect.ValueOf(newS)
	if newSVal.Kind() != reflect.Ptr || newSVal.Elem().Kind() != reflect.Struct {
		return fmt.Errorf("newS must be a pointer to a struct")
	}

	// Loop through the fields of newS and update the corresponding fields in s
	for i := 0; i < newSVal.Elem().NumField(); i++ {
		fieldName := newSVal.Elem().Type().Field(i).Name
		if Contains(fieldsToExclude, fieldName) {
			continue
		}
		newField := newSVal.Elem().Field(i)
		sField := sVal.Elem().FieldByName(fieldName)
		if !sField.IsValid() {
			return fmt.Errorf("field %s not found in s", fieldName)
		}
		if !sField.CanSet() {
			return fmt.Errorf("field %s cannot be set in s", fieldName)
		}
		sField.Set(newField)
	}

	return nil
}
