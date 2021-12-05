import { writeFileSync } from 'fs'
import { range } from 'lodash'
import * as scribble from 'scribbletune'
import text2png from 'text2png'

// write 0.json, 0.png, 0.mid

const numNfts = range(0, 3)
console.dir(numNfts)

console.log('Creating NFT assets...')

numNfts.forEach(n => {

  const png = text2png('Dm BbM Am FM BbM FM CM Gm', {
    color: 'blue',
    backgroundColor: 'white' 
  })

  writeFileSync(`assets/${n}.png`, png)

  const clips = ['1032', '2032', '4021', '3052'].map(order =>
    scribble.clip({
      pattern: '[xx][xR]'.repeat(4),
      notes: scribble.arp({
        chords: 'Dm BbM Am FM BbM FM CM Gm',
        count: 8,
        order,
      }),
      accent: 'x-xx--xx',
    })
  )
  scribble.midi([].concat(...clips), `assets/${n}.mid`)

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
          "address": "INSERT_CREATOR_WALLET_ADDRESS_HERE",
          "share": 100
        }
      ]
    }
  }

  writeFileSync(`assets/${n}.json`, JSON.stringify(json))

})
