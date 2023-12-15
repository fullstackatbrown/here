package privacy

import "fmt"

var (
	invalidLocatorDataType = fmt.Errorf("invalid locator data type")
)

func cannotCastFieldToType(field string, castType string) error {
	return fmt.Errorf("cannot cast %s to %s", field, castType)
}
