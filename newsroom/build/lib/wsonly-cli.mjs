// prints the count of what rests only on websummit.com (run by validate.js rule 15 in a child process: wsonly.mjs is an ES module)
import { wsGate } from './wsonly.mjs'
import { loadData } from './data.mjs'
console.log(wsGate(loadData()))
