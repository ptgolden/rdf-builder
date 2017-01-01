"use strict";

const test = require('tape')

test('Single triple builder', t => {
  t.plan(1);

  const $ = require('./')({})

  const triple = $('http://example.com/s')('http://example.com/p')('http://example.com/o');

  t.deepEqual(triple, {
    subject: 'http://example.com/s',
    predicate: 'http://example.com/p',
    object: 'http://example.com/o'
  })
})

test('Multiple triple builder', t => {
  t.plan(1);

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
})
