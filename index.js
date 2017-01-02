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

function formatStatement(opts, { subject, predicate, object }) {
  const ret = {
    subject: formatProperty(opts, subject),
    predicate: formatProperty(opts, predicate),
    object: formatProperty(opts, object),
  }

  if (opts.graph) {
    ret.graph = formatProperty(opts, opts.graph)
  }

  return ret;
}

function expand(subject, value) {
  return [].concat(...Object.keys(value).map(predicate =>
      Array.isArray(value[predicate])
        ? value[predicate].map(object => ({ subject, predicate, object }))
        : { subject, predicate, object: value[predicate] }))
}

module.exports = function (opts) {
  const fmt = formatStatement.bind(null, opts)
      , { graph } = opts

  return subject => {
    const func = predicate =>
      typeof predicate === 'object'
        ? expand(subject, predicate).map(fmt)
        : Object.assign(object => fmt({ subject, predicate, object }), {
            subject,
            predicate
          }, graph ? { graph } : {} )

    func[subjectURI] = subject;
    func.subject = subject;
    func.toJSON = () => subject;
    if (graph) {
      func.graph = graph;
    }

    return func;
  }
}
