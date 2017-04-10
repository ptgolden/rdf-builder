# RDF Builder
Utility library built on top of [N3](http://npmjs.com/package/n3) to
conveniently build [RDF](http://w3.org/RDF) triples and quads.

```js
const prefixes = {
  ex: 'http://example.com/#',
  foaf: require('lov-ns/foaf')
}

const $ = require('rdf-builder')({ prefixes })

$('ex:Alice')('foaf:knows')('ex:Bob')
// { subject: 'http://example.com/#Alice'
// , predicate: 'http://xmlns.com/foaf/0.1/knows'
// , object: 'http://example.com/#Bob' }
```


# Use
This library provides a single, curried function.

It must first be called with an options object.

```js
require('rdf-builder')(opts)
// Function
```

There are two optional options:

  * **prefixes** (object): An object of key-value pairs to expand prefixed
    names. This library uses the same prefix notation as Turtle
    (`prefix:restOfIdentifier`)

  * **graph** (string): If provided, the builder will construct RDF quads with
    the graph set to this value. If the graph is omitted, it will construct
    RDF triples.

For brevity, the following example will assume that the variable `$` represents
the statement builder after its options have been supplied. We will proceed
assuming that we will be building triples (not quads), and we will define two
namesapce prefixes: `ex`, and `foaf`, with the latter pulled from the
[lov-ns](http://npmjs.com/package/lov-ns) NPM package.

```js
const prefixes = {
  ex: 'http://example.com/#',
  foaf: require('lov-ns/foaf')
}

const $ = require('rdf-builder')({ prefixes })
```

The resultant function must be called with a URI that will be the subject
of the triple.

```js
$('ex:s')
// Function
```

At this point, the resultant function can be used in one of two ways.

To build a single triple, simply supply two more arguments that will be
treated as the predicate and object of the triple.

```js
$('ex:s')('ex:p')('ex:o')
// { subject: 'http://example.com/#s'
// , predicate: 'http://example.com/#p'
// , object: 'http://example.com/#o' }
```

To build multiple triples, apply one more argument: a JS Object whose keys will
be treated as predicates, and whose values will be treated as objects. If a
value is an array, triples will be returned for each element as an RDF object.

```js
$('ex:s')({
  'ex:p1': 'ex:o1',
  'ex:p2': [
    'ex:o2',
    'ex:o3',
  ]
})
// Array of 3 triple objects for these statments:
// ex:s -> ex:p1 -> ex:o1
// ex:s -> ex:p2 -> ex:o2
// ex:s -> ex:p2 -> ex:o3
```

The same array of triples can be produced by using a nested object.

```js
$({
  'ex:s': {
    'ex:p1': 'ex:o1',
    'ex:p2': [
      'ex:o2',
      'ex:o3',
    ]
  }
})
```

When only one property (i.e. the subject) has been supplied, the resultant
function can also be used as a property in building other triples.

```js
const s = $('ex:Alice')
    , p = $('foaf:knows')
    , o = $('ex:Bob')

s(p)(o)
// Produces the same output as s('foaf:knows')('ex:Bob')
```
