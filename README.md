# Shortlinker

Implements a basic Bit.ly style URL shortener using [Cloud Functions for Firebase](https://firebase.google.com/docs/functions/).

## Usage

Create a shortlink by executing a POST request:

```
POST / HTTP/1.1
Host: fkit.io
Content-Type: application/json
Authorization: Bearer P3dzz97Jht4coS0Lk8CvJP31ziuUg2rGFxr3D3a0
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

## License

See [LICENSE.md](LICENSE.md).