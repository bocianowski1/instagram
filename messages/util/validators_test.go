package util

import "testing"

func TestValidateUsername(t *testing.T) {
	validUsername := "admin"

	if !ValidateUsername(validUsername) {
		t.Errorf("Expected %s to be valid username", validUsername)
	}
}
