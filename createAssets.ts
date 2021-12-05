import { writeFileSync } from 'fs'
import { range } from 'lodash'

// write 0.json, 0.png, 0.mid

const numNfts = range(0, 3)
console.dir(numNfts)

console.log('Creating NFT assets...')

numNfts.forEach(n => {
    writeFileSync(`assets/${n}.png`, '')
    writeFileSync(`assets/${n}.mid`, '')
    writeFileSync(`assets/${n}.json`, '')
})