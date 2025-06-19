function ensureAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login');
}

function ensureGuest(req, res, next) {
  if (!req.session || !req.session.user) {
    return next();
  }
  res.redirect('/');
}
function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Access denied');
}


module.exports = { ensureAuth, ensureGuest, ensureAdmin };
