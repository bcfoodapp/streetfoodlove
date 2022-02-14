package main

import (
	"net/http"
	"testing"
	"time"
)

// TestServer starts the server and succeeds the test when the root path is accessible.
func TestServer(t *testing.T) {
	if testing.Short() {
		t.Skip()
	}

	go func() {
		defer func() {
			if e := recover(); e != nil {
				t.Error(e)
				return
			}
		}()

		main()
	}()

	client := http.Client{
		Timeout: time.Minute,
	}

	for {
		time.Sleep(time.Second)
		resp, err := client.Get("http://localhost:8080")
		if err == nil {
			resp.Body.Close()
			return
		}
	}
}
