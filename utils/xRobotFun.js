

function xRobotsAllApi(req, res, next) {
    // Apply the header to all requests under /api
    if (req.path.startsWith('/api')) {
      res.set('X-Robots-Tag', 'noindex, nofollow');
    }
    next();
  }

  export default xRobotsAllApi;
  