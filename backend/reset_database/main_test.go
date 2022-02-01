package main

import (
	"testing"
)

// Ensures that all SQL commands have no syntax errors.
func TestResetDatabase(t *testing.T) {
	defer func() {
		if e := recover(); e != nil {
			t.Fatal(e)
		}
	}()

	main()
}
