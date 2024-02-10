package util

import "testing"

func TestValidateUsername(t *testing.T) {
	validUsername := "admin"

	if !ValidateUsername(validUsername) {
		t.Errorf("Expected %s to be valid username", validUsername)
	}

	validUsername = "guest"

	if !ValidateUsername(validUsername) {
		t.Errorf("Expected %s to be valid username", validUsername)
	}

	invalidUsername := "invalid"

	if ValidateUsername(invalidUsername) {
		t.Errorf("Expected %s to be invalid username", invalidUsername)
	}
}
