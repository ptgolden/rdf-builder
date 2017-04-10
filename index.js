"use strict";

const Util = require('n3/lib/N3Util')
    , subjectURI = Symbol('subjectURI')

function isObject(obj) {
  return obj.constructor === Object;
}

function formatProperty({ prefixes }, val) {
  if (val[subjectURI]) {
    val = val[subjectURI];
  }

  if (Util.isLiteral(val)) {
    return val;
  }

  if (Util.isPrefixedName(val)) {
    return Util.expandPrefixedName(val, prefixes)
  }

  return val;
}

function formatStatement(opts, { subject, predicate, object }) {
  return Object.assign(opts.graph ? { graph: opts.graph } : {}, {
    subject: formatProperty(opts, subject),
    predicate: formatProperty(opts, predicate),
    object: formatProperty(opts, object),
  })
}


function build1(opts, subject) {
  if (isObject(subject)) {
    const obj = subject

    return [].concat(...Object.keys(obj).map(subject =>
      build2(opts, subject, obj[subject])))
  }


  const func = predicate => build2(opts, subject, predicate)

  func[subjectURI] = subject;
  func.subject = subject;
  func.toJSON = () => subject;

  return func;
}

function build2(opts, subject, predicate) {
  if (isObject(predicate)) {
    const obj = predicate

    return [].concat(...Object.keys(obj).map(predicate =>
      Array.isArray(obj[predicate])
        ? obj[predicate].map(object => ({ subject, predicate, object }))
        : { subject, predicate, object: obj[predicate] }))
      .map(s => formatStatement(opts, s))
  }

  return object => build3(opts, subject, predicate, object)
}

function build3(opts, subject, predicate, object) {
  return formatStatement(opts, { subject, predicate, object })
}

const fnsByArity = {
  1: build1,
  2: build2,
  3: build3,
}

function rdfBuilder(opts={}) {
  return (...args) => fnsByArity[args.length](opts, ...args)
}

module.exports = rdfBuilder;
