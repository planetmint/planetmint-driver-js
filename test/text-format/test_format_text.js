// Copyright © 2020 Interplanetary Database Association e.V.,
// Planetmint and IPDB software contributors.
// SPDX-License-Identifier: (AGPL-3.0-or-later AND CC-BY-4.0)
// Code is AGPL-3.0-or-later and docs are CC-BY-4.0

import test from 'ava'
import formatText from '../../src/format_text'

test('formatText test type 1', t => {
    const expected = 'Hi there Dimi!'
    const actual = formatText('Hi there ${dimi}!', { dimi: 'Dimi' }) // eslint-disable-line no-template-curly-in-string

    t.is(actual, expected)
})

test('formatText test type 2', t => {
    const expected = 'Planetmint is fresh'
    const actual = formatText('${database} is %(status)s', { // eslint-disable-line no-template-curly-in-string
        database: 'Planetmint',
        status: 'fresh'
    })

    t.is(actual, expected)
})

test('formatText test type 3', t => {
    const expected = 'Berlin is best known for its Currywurst'
    const actual = formatText(
        'Berlin is best known for its ${berlin.topKnownFor[0].name}', // eslint-disable-line no-template-curly-in-string
        {
            berlin: {
                topKnownFor: [
                    {
                        name: 'Currywurst'
                    }
                ]
            }
        }
    )

    t.is(actual, expected)
})

test('formatText test throws', t => {
    t.throws(() => {
        formatText(
            'This will give ${error.}', // eslint-disable-line no-template-curly-in-string
            { error: [{}] }
        )
    }, { instanceOf: SyntaxError, message: '[formatText] failed to parse named argument key: error.' })
})
