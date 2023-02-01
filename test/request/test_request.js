// Copyright © 2020 Interplanetary Database Association e.V.,
// Planetmint and IPDB software contributors.
// SPDX-License-Identifier: (AGPL-3.0-or-later AND CC-BY-4.0)
// Code is AGPL-3.0-or-later and docs are CC-BY-4.0

import test from 'ava'
import Connection from '../../src/connection'

const conn = new Connection()

test('Ensure that BackoffTimedelta works properly', t => {
    const req = conn.transport.pickConnection()
    req.backoffTime = Date.now() + 50
    const target = req.getBackoffTimedelta()
    // The value should be close to 50
    t.is(target > 45, true)
})

test('Ensure that updateBackoffTime throws and error on TimeoutError', async t => {
    const req = conn.transport.pickConnection()
    const errorMessage = 'TimeoutError'
    req.connectionError = new Error(errorMessage)

    t.throws(() => {
        req.updateBackoffTime()
    }, { instanceOf: Error, message: errorMessage })
})
