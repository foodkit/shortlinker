// Package p contains an HTTP Cloud Function.
package p

import (
	"encoding/json"
	"fmt"
	"html"
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

func PostLink() {
	// @todo
}

func GetLink(w http.ResponseWriter, r *http.Request) {
	// @todo: check the database
	// - if not exists, 404
	// - if exists, redirect
}

func HandleRequest(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://google.com/search?q=redirection", 301)
}

