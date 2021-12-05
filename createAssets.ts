import { readFileSync, writeFileSync } from 'fs'
import { range } from 'lodash'
import * as scribble from 'scribbletune'
import text2png from 'text2png'
import * as IPFS from 'ipfs-core'

const root = 'B2';
const scale = 'minor';

const getRandomPattern = (count = 8) => {
  let str = '[x-]R'
  for (let i = 1; i < count; i++) {
    str += Math.round(Math.random()) ? '[x-]R' : 'R[x-]'
  }

  return str
}

const createMidi = (pattern) => {
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

  return scribble.midi([].concat(clipA, clipA, clipA, clipB), null)
}

const createAssets = async (ipfs) => {
  console.log('Creating NFT assets...')
  const nfts = range(0, 3)
  for (let n = 0; n < nfts.length; n++) {
    const pattern = getRandomPattern()
    const midiBuffer = createMidi(pattern)
    if (!midiBuffer) {
      throw new Error('Error creating midi')
    }
    writeFileSync(`assets/${n}.mid`, Buffer.from(midiBuffer.toString()))

    const assetsMidi = readFileSync(`assets/${n}.mid`)
    
    const { cid } = await ipfs.add(midiBuffer.toString())
    console.log('Stored in ipfs', cid)

    const png = text2png(pattern, {
      color: 'blue',
      backgroundColor: 'white'
    })

    writeFileSync(`assets/${n}.png`, png)

    const json = {
      "name": `Midi Audio NFT #${n}`,
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
            "uri": `${cid}`,
            "type": "audio/midi"
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

const initIpfs = async () => {
  const ipfs = await IPFS.create()
  await createAssets(ipfs)
}

initIpfs().then(() => process.exit(0)).catch(err => console.log(err))
