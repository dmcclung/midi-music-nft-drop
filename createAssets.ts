import { writeFileSync } from 'fs'
import { range } from 'lodash'
import * as scribble from 'scribbletune'
import text2png from 'text2png'

const root = 'B2'
const scale = 'minor'

const getRandomPattern = (count = 8) => {
  let str = '[x-]R'
  for (let i = 1; i < count; i++) {
    str += Math.round(Math.random()) ? '[x-]R' : 'R[x-]'
  }

  return str
}

// TODO: Automate converting midi to ogg for browser playback
const createMidi = (filename, pattern) => {
  const clipA = scribble.clip({
    notes: root,
    randomNotes: scribble.arp(
      scribble.getChordsByProgression(root + ' ' + scale, 'ii iii')
    ),
    pattern,
    subdiv: '16n',
  })

  const clipB = scribble.clip({
    notes: root,
    randomNotes: scribble.arp(
      scribble.getChordsByProgression(root + ' ' + scale, 'vi v')
    ),
    pattern,
    subdiv: '16n',
  })

  return scribble.midi([].concat(clipA, clipA, clipA, clipB), filename)
}

const createAssets = async () => {
  console.log('Creating NFT assets...')
  const nfts = range(0, 3)
  for (let n = 0; n < nfts.length; n++) {
    const pattern = getRandomPattern()
    createMidi(`assets/${n}.mid`, pattern)

    const name = `Midi Audio NFT #${n}`

    const png = text2png(name, {
      color: 'white',
      backgroundColor: 'black'
    })

    writeFileSync(`assets/${n}.png`, png)

    const json = {
      "name": name,
      "symbol": "MIDI",
      "image": `${n}.png`,
      "properties.category": "audio",
      "properties": {
        "files": [
          {
            "uri": `${n}.png`,
            "type": "image/png"
          },
          {
            "uri": `<INSERT IPFS URI>`,
            "type": "audio/ogg"
          }
        ],
        "creators": [
          {
            "address": "Br7YiN2PkG7JeSEreHRfzuXtU6TJUiAUswqoCoqvt2b4",
            "share": 100
          }
        ]
      }
    }

    writeFileSync(`assets/${n}.json`, JSON.stringify(json))
  }
}

createAssets().then(() => process.exit(0)).catch(err => console.log(err))
