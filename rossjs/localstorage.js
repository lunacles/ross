const LocalStorage = class {
  static watch(entry) {
    return new LocalStorage(entry)
  }
  static clear() {
    localStorage.clear()
  }
  constructor(entry) {
    this.entry = entry
    this.stored = this.get()
  }
  set({ value = null, expiration = Infinity }) {
    this.stored = value
    this.expiration = expiration
    let expiry = expiration ? Date.now() + expiration : null
    localStorage.setItem(this.entry, JSON.stringify({ value, expiry }))
    return this
  }
  get() {
    let item = localStorage.getItem(this.entry)
    if (item) {
      let { value, expiry } = JSON.parse(item)
      this.stored = item
      this.expiration = expiry
      if (expiry === null || expiry >= Date.now()) return value
      this.delete()
    }
    return null
  }
  delete() {
    localStorage.removeItem(this.entry)
    this.stored = null
  }
  verifyIntegrity({ expected, defaultTo }) {
    if (expected === 'array' && !Array.isArray(this.stored)) {
      this.set({ value: defaultTo })
    } else if (expected !== 'array' && typeof this.stored !== expected) {
      this.set({ value: defaultTo })
    }
  }
}

export default LocalStorage
