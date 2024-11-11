import util from 'util'

export const deepPrint = (obj: any) => console.log(util.inspect(obj, {depth: null, colors: true}))
