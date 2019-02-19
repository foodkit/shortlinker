// Package p contains an HTTP Cloud Function.
package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"net/http"
)

// Generates a random base64 number encoded into a URL-compatible string.
func token() (string, error) {
	var bytes [9]byte

	_, err := rand.Read(bytes[:])
	if err != nil {
		return "", err
	}

	return base64.URLEncoding.EncodeToString(bytes[:]), nil
}

func get() {}

func put() {}

func PostLink(w http.ResponseWriter, r *http.Request) {
	// @todo
	// 1. authorize by checking the header
	// 2. sanitize input
	// 3. find or create
	// 4. return response
	fmt.Println("PostLink")
}

func GetLink(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Entering GetLink...")

	// @todo: check the database
	// - if not exists, 404

	// - if exists, redirect
	link = "https://foodkit.io/some/long/url?with=optional_query_string_params"
	http.Redirect(w, r, link, 301)
}

func HandleRequest(w http.ResponseWriter, r *http.Request) {

	if r.Method == "POST" {
		PostLink(w, r)
	} else {
		GetLink(w, r)
	}

	// http.Redirect(w, r, "https://google.com/search?q=redirection", 301)
}

func main() {
	r, _ := http.NewRequest("GET", "/BA-kUXa-gMj5", nil)
	HandleRequest(nil, r)
}
