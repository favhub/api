const {to} = require("await-to-js");

const awaitTo = async (promise) => {
  let err, res;
  [err, res] = await to(promise);

  if (err) {
    return [err, null];
  }
  return [null, res];
};

const resErr = function(res, err) {
  res.statusCode = 400;
  return res.json({
    error: typeof err == "object" && typeof err.message != "undefined" ? err.message : err,
    success: false
  });
};

const resSucc = function(res, data, extra) {
  return res.json({data, ...extra, success: true});
};

module.exports = {to: awaitTo, resErr, resSucc};
