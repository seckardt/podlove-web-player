import { get } from 'lodash'
import { compose, map } from 'lodash/fp'

import { secondsToMilliseconds, millisecondsToSeconds } from 'utils/time'

import actions from '../actions'

let player = null

export default mediaPlayer => (store, action) => {
  const state = store.getState()

  switch (action.type) {
    case 'INIT':
      const audioFiles = get(action.payload, 'audio', [])

      if (audioFiles.length === 0) {
        store.dispatch(actions.errorMissingAudioFiles())
        return
      }

      player = mediaPlayer(audioFiles)

      // register events
      player.events.onPlaytimeUpdate(compose(store.dispatch, actions.setPlaytime, secondsToMilliseconds))
      player.events.onDurationChange(compose(store.dispatch, actions.setDuration, secondsToMilliseconds))
      player.events.onBufferChange(compose(store.dispatch, actions.setBuffer, map(([start, stop]) => [secondsToMilliseconds(start), secondsToMilliseconds(stop)])))
      player.events.onPlay(compose(store.dispatch, actions.playEvent))
      player.events.onPause(compose(store.dispatch, actions.pauseEvent))
      player.events.onLoaded(compose(store.dispatch, actions.loaded))
      player.events.onError(compose(store.dispatch, actions.errorLoad))
      player.events.onBuffering(compose(store.dispatch, actions.loading))
      player.events.onEnd(compose(store.dispatch, actions.endEvent))
      break
    case 'UI_PLAY':
      player && player.actions.setPlaytime(millisecondsToSeconds(state.playtime))
      player && player.actions.play()
      break
    case 'UI_PAUSE':
      player && player.actions.pause()
      break
    case 'UI_RESTART':
      player && player.actions.restart()
      player && player.actions.play()
      break
    case 'UPDATE_PLAYTIME':
      player && player.actions.setPlaytime(millisecondsToSeconds(action.payload))
      break
    case 'SET_VOLUME':
      console.log(player)
      player && player.actions.setVolume(action.payload)
      break
    case 'SET_RATE':
      player && player.actions.setRate(action.payload)
      break
    case 'MUTE':
      player && player.actions.mute()
      break
    case 'UNMUTE':
      player && player.actions.unmute()
      break
    case 'LOAD':
      player && player.actions.load()
      break
  }
}
