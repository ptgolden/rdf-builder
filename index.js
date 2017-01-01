"use strict";

const Util = require('n3/lib/N3Util')

function format(val, PREFIXES) {
  val = val.toString();

  if (Util.isLiteral(val)) {
    return val;
  }

  if (Util.isPrefixedName) {
    return Util.expandPrefixedName(val, PREFIXES)
  }
}

module.exports = function (opts) {
  const { prefixes } = opts

  return function tripleFactory(subject) {
    const func = predicate => object => ({
      subject: format(subject, prefixes),
      predicate: format(predicate, prefixes),
      object: format(object, prefixes),
    })

    func.toString = () => subject;

    return func;
  }
}
