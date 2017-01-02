"use strict";

const Util = require('n3/lib/N3Util')
    , subjectURI = Symbol('subjectURI')

function formatProperty({ prefixes }, val) {
  if (val[subjectURI]) {
    val = val[subjectURI];
  }

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
    const func = predicate =>
      typeof predicate === 'object'
        ? expand(subject, predicate).map(fmt)
        : Object.assign(object => fmt({ subject, predicate, object }), {
            subject,
            predicate
          })

    func[subjectURI] = subject;
    func.subject = subject;
    func.toJSON = () => subject;

    return func;
  }
}
