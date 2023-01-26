// Copyright © 2020 Interplanetary Database Association e.V.,
// Planetmint and IPDB software contributors.
// SPDX-License-Identifier: (AGPL-3.0-or-later AND CC-BY-4.0)
// Code is AGPL-3.0-or-later and docs are CC-BY-4.0

import test from 'ava'
import rewire from 'rewire'

const sanitize = rewire('../../src/sanitize.js')
const applyFilterOnObject = sanitize.__get__('applyFilterOnObject')
const filterFromObject = sanitize.__get__('filterFromObject')

test('Ensure that null filter returns same object', t => {
    const expected = { 'testObj': 'test' }
    const actual = applyFilterOnObject({ 'testObj': 'test' }, null)

    t.deepEqual(actual, expected)
})

test('Ensure function filter with isInclusion true works properly', t => {
    const testObj = [true, false, undefined, '', 0, null]
    const expected = { 0: true }
    const actual = filterFromObject(testObj, (val) => !!val, { isInclusion: true })

    t.deepEqual(actual, expected)
})

test('Ensure function filter with isInclusion false works properly', t => {
    const testObj = [false, true, 1, 10, 'this will be removed as it is truthy']
    const expected = { 0: false }
    const actual = filterFromObject(testObj, (val) => !!val, { isInclusion: false })

    t.deepEqual(actual, expected)
})

test('Ensure array filter with isInclusion true works properly', t => {
    const testObj = [true, false, undefined, '', 0, null]
    const expected = { 0: true }
    const actual = filterFromObject(testObj, [true], { isInclusion: true })

    t.deepEqual(actual, expected)
})

test('Ensure array filter with isInclusion false works properly', t => {
    const testObj = [false, true, 1, 10]
    const expected = { 0: false }
    const actual = filterFromObject(testObj, [true, 1, 10], { isInclusion: false })

    t.deepEqual(actual, expected)
})

test('Ensure throws error when given invalid filter', t => {
    t.throws(() => {
        filterFromObject({}, 'lol')
    }, { instanceOf: Error, message: 'The given filter is not an array or function. Filter aborted' })
})
