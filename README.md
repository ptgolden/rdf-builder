# RDF Triple Builder
Utility library built on top of [N3](http://npmjs.com/package/n3) to conveniently build groups of RDF triples.

```js
const $ = require('triple-builder')({
  prefixes: { ex: 'http://example.com/' }
})

console.log($('ex:s')('ex:p')('ex:o'))
/* { subject: 'http://example.com/s'
   , predicate: 'http://example.com/p'
   , object: 'http://example.com/o' } */
```


# Use
This library provides a single, curried function.

It must first be called with an options object.

```js
tripleBuilder({ prefixes })
// Function
```

The resultant function must be called with a URI that will be the subject
of the triple.

```js
tripleBuilder({ prefixes })('ex:s')
// Function
```

At this point, the resultant function can be used in one of two ways.

To build a single triple, simply supply two more arguments that will be
treated as the predicate and object of the triple.

```js
tripleBuilder({ prefixes })('ex:s')('ex:p')('ex:o')
// Object({ subject, predicate, object })
```

To build multiple triples, apply one more argument: a JS Object whose keys will
be treated as predicates, and whose values will be treated as objects. If a
value is an array, triples will be returned for each element as an RDF object.

```js
tripleBuilder({ prefixes })('ex:s')({
  'ex:p1': 'ex:o1',
  'ex:p2': [
    'ex:o2',
    'ex:o3',
  ]
})
// Array of 3 triple objects
```

When only one property (i.e. the subject) has been supplied, the resultant
function can also be used as a property in building other triples.

```js
const $ = tripleBuilder({ prefixes })
    , s = $('ex:s')
    , p = $('ex:p')
    , o = $('ex:o')

s(p)(o)
// Produces the same output as s('ex:p')('ex:o')
```
