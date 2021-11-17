package main

import (
	"fmt"
	"net/http"
)

func StreetFoodLove(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "StreetFoodLove\n")
}

func headers(w http.ResponseWriter, req *http.Request) {

	for name, headers := range req.Header {
		for _, h := range headers {
			fmt.Fprintf(w, "%v: %v\n", name, h)
		}
	}
}

func main() {
	http.HandleFunc("/Hello", StreetFoodLove)
	http.HandleFunc("/headers", headers)
	http.ListenAndServe(":8090", nil)
}
