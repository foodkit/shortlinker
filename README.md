# Shortlinker

Implements a basic Bit.ly style URL shortener using [Cloud Functions for Firebase](https://firebase.google.com/docs/functions/).

## Usage

Create a shortlink by executing a POST request:

```
POST / HTTP/1.1
Host: fkit.io
Content-Type: application/json
Authorization: Bearer P3dzz97Jht4coS0Lk8CvJP31ziuUg2rGFxr3D3b9
{
  "long_url": "https://foodkit.io/some/long/url?with=optional_query_string_params"
}

HTTP/1.1 200 OK
{
  "link": "https://fkit.io/BA-kUXa-gMj5"
}
```

Expand a shortlink by executing a GET request:

```
GET /BA-kUXa-gMj5 HTTP/1.1
Host: fkit.io
Content-Type: application/json

HTTP/1.1 301 Moved Permanently
Location: https://foodkit.io/some/long/url?with=optional_query_string_params
```

## Deployment

```
# Make sure Firebase CLI tools are installed
brew install firebase-cli

# Add auth credentials
firebase login
#... (complete login in browser window)

# Deploy function
firebase deploy --only functions
```

If you're deploying to a new Firebase account you'll also need to set environment variable:

```
# Set a list of acceptable API tokens which authorize the client to use the service when sent as a bearer token:
firebase functions:config:set shortlinks.keys="BEARER_TOKEN1,BEARER_TOKEN2"
```

[See here](https://firebase.google.com/docs/functions/manage-functions) for details.

## License

See [LICENSE.md](LICENSE.md).