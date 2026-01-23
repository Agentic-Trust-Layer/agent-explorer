import { canonicalize } from './canonicalize'

declare global {
  // if it is prototype, like this: DateConstructor
  interface JSON {
    canonicalize: (object: any) => string
  }
}

if (!JSON.canonicalize) {
  JSON.canonicalize = canonicalize
}
