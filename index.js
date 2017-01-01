"use strict";

const Util = require('n3/lib/N3Util')

function formatProperty({ prefixes }, val) {
  val = val.toString();

  if (Util.isLiteral(val)) {
    return val;
  }

  if (Util.isPrefixedName) {
    return Util.expandPrefixedName(val, prefixes)
  }
}

function formatTriple(opts, { subject, predicate, object }) {
  return {
    subject: formatProperty(opts, subject),
    predicate: formatProperty(opts, predicate),
    object: formatProperty(opts, object),
  }
}

function expand(subject, value) {
  return [].concat(...Object.keys(value).map(predicate =>
      Array.isArray(value[predicate])
        ? value[predicate].map(object => ({ subject, predicate, object }))
        : { subject, predicate, object: value[predicate] }))
}

module.exports = function (opts) {
  const fmt = formatTriple.bind(null, opts)

  return subject => {
    const func = value =>
      typeof value === 'object'
        ? expand(subject, value).map(fmt)
        : object => fmt({ subject, predicate: value, object })

    func.toString = () => subject;

    return func;
  }
}
