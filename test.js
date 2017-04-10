"use strict";

const test = require('tape')

test('Triple builder', t => {
  t.plan(4);

  const $ = require('./')({})

  const triple = $('http://example.com/s')('http://example.com/p')('http://example.com/o');

  t.deepEqual(triple, {
    subject: 'http://example.com/s',
    predicate: 'http://example.com/p',
    object: 'http://example.com/o'
  })

  t.deepEqual(triple, $('http://example.com/s', 'http://example.com/p', 'http://example.com/o'))

  const partialTriple = $('http://example.com/s')('http://example.com/p')

  t.ok(typeof partialTriple === 'function');
  t.equal(JSON.stringify($('http://example.com/s')), '"http://example.com/s"');
})

test('Quad builder', t => {
  t.plan(1);

  const $ = require('./')({ graph: 'http://example.com/g' })

  const quad = $('http://example.com/s')('http://example.com/p')('http://example.com/o');

  t.deepEqual(quad, {
    graph: 'http://example.com/g',
    subject: 'http://example.com/s',
    predicate: 'http://example.com/p',
    object: 'http://example.com/o'
  }, 'should allow generating quads')

})


test('Multiple triple builder', t => {
  t.plan(2);

  const $ = require('./')({})

  const triples = $('http://example.com/s')({
    'http://example.com/p1': [
      'http://example.com/o1a',
      'http://example.com/o1b',
    ],
    'http://example.com/p2': 'http://example.com/o2'
  })

  t.deepEqual(triples, [
    {
      subject: 'http://example.com/s',
      predicate: 'http://example.com/p1',
      object: 'http://example.com/o1a',
    },
    {
      subject: 'http://example.com/s',
      predicate: 'http://example.com/p1',
      object: 'http://example.com/o1b',
    },
    {
      subject: 'http://example.com/s',
      predicate: 'http://example.com/p2',
      object: 'http://example.com/o2',
    }
  ])

  const triples2 = $({
    'http://example.com/s': {
      'http://example.com/p1': [
        'http://example.com/o1a',
        'http://example.com/o1b',
      ],
      'http://example.com/p2': 'http://example.com/o2'
    }
  })

  t.deepEqual(triples, triples2);
})

test('Namespace expansion', t => {
  t.plan(1);

  const $ = require('./')({
    prefixes: {
      ex: 'http://example.com/'
    }
  })

  const triple = $('ex:s')('ex:p')('ex:o')

  t.deepEqual(triple, {
    subject: 'http://example.com/s',
    predicate: 'http://example.com/p',
    object: 'http://example.com/o'
  })
})

test('Factory functions as properties', t => {
  t.plan(1);

  const $ = require('./')({
    prefixes: {
      ex: 'http://example.com/'
    }
  })

  const s = $('ex:s')
      , p = $('ex:p')
      , o = $('ex:o')

  const triple = s(p)(o)

  t.deepEqual(triple, {
    subject: 'http://example.com/s',
    predicate: 'http://example.com/p',
    object: 'http://example.com/o'
  })
})
