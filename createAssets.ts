import { writeFileSync } from 'fs'
import { range } from 'lodash'
import * as scribble from 'scribbletune'
import text2png from 'text2png'

const numNfts = range(0, 3)
console.dir(numNfts)

console.log('Creating NFT assets...')

const root = 'B2';
const scale = 'minor';

const getRandomPattern = (count = 8) => {
  let str = '[x-]R'
  for (let i = 1; i < count; i++) {
    str += Math.round(Math.random()) ? '[x-]R' : 'R[x-]'
  }

  return str
}

numNfts.forEach(n => {

  const pattern = getRandomPattern()

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

  scribble.midi([].concat(clipA, clipA, clipA, clipB), `assets/${n}.mid`)

  const png = text2png(pattern, {
    color: 'blue',
    backgroundColor: 'white' 
  })

  writeFileSync(`assets/${n}.png`, png)

  const json = {
    "name": `Midi Audio NFT #${n}`,
    "symbol": "MIDI",
    "image": `${n}.png`,
    "properties": {
      "files": [
        {
          "uri": `${n}.png`,
          "type": "image/png"
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

})
