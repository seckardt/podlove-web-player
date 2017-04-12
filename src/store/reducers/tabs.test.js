import test from 'ava'
import { tabs } from './tabs'

let testState

test.beforeEach(t => {
    testState = {
        'chapters': false,
        'settings': false
    }
})

test(`tabs: is a reducer function`, t => {
    t.is(typeof tabs, 'function')
})

test(`tabs: it toggles the tabs on TOGGLE_TAB`, t => {
    let result = tabs(undefined, {
        type: 'TOGGLE_TAB',
        payload: 'chapters'
    })

    testState.chapters = true

    t.deepEqual(result, testState)

    result = tabs(result, {
        type: 'TOGGLE_TAB',
        payload: 'chapters'
    })

    testState.chapters = false

    t.deepEqual(result, testState)
})

test(`tabs: it does nothing if a unknown action is dispatched`, t => {
    const result = tabs(undefined, {
        type: 'NOT_A_REAL_TYPE'
    })

    t.deepEqual(result, testState)
})