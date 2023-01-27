// Copyright © 2020 Interplanetary Database Association e.V.,
// Planetmint and IPDB software contributors.
// SPDX-License-Identifier: (AGPL-3.0-or-later AND CC-BY-4.0)
// Code is AGPL-3.0-or-later and docs are CC-BY-4.0

import { TIMEOUT_ERROR } from './baseRequest'
import Request from './request'

/**
 *
 * @private
 * If initialized with ``>1`` nodes, the driver will send successive
 * requests to different nodes in a round-robin fashion (this will be
 * customizable in the future).
 */

export default class Transport {
    constructor(nodes, timeout) {
        this.connectionPool = []
        this.timeout = timeout
        // the maximum backoff time is 10 seconds
        this.maxBackoffTime = timeout ? timeout / 2 : 10000
        nodes.forEach(node => {
            this.connectionPool.push(new Request(node))
        })
    }

    // Select the connection with the earliest backoff time, in case of a tie,
    // prefer the one with the smaller list index
    pickConnection() {
        let connection = this.connectionPool[0]

        this.connectionPool.forEach(conn => {
            // 0 the lowest value is the time for Thu Jan 01 1970 01:00:00 GMT+0100 (CET)
            conn.backoffTime = conn.backoffTime ? conn.backoffTime : 0
            connection = (conn.backoffTime < connection.backoffTime) ? conn : connection
        })
        return connection
    }

    async forwardRequest(path, config) {
        let response
        let connection
        // A new request will be executed until there is a valid response or timeout < 0
        while (this.timeout >= 0) {
            connection = this.pickConnection()
            // Date in milliseconds
            const startTime = Date.now()
            // eslint-disable-next-line no-await-in-loop
            response = await connection.request(
                path,
                config,
                this.timeout,
                this.maxBackoffTime
            )
            const elapsed = Date.now() - startTime
            if (connection.backoffTime > 0 && this.timeout > 0) {
                this.timeout -= elapsed
            } else {
                // No connection error, the response is valid
                return response
            }
        }
        throw new Error(TIMEOUT_ERROR)
    }
}
