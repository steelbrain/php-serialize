export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">PHP-Serialize</h1>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
            serialize and unserialize PHP data structures in JavaScript
          </p>
          <div className="flex justify-center gap-4 mb-12">
            <a
              href="https://www.npmjs.com/package/php-serialize"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
            >
              <span>Latest Release</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <title>External link to npm package</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
            <a
              href="https://github.com/steelbrain/php-serialize"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border hover:bg-accent hover:text-accent-foreground px-6 py-3 font-medium transition-colors"
            >
              <span>View on GitHub</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <title>External link to GitHub repository</title>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold mb-3">PHP Compatibility</h3>
              <p className="text-muted-foreground">Fully compatible with PHP&apos;s serialize/unserialize functions for seamless data exchange</p>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold mb-3">Serializable Objects</h3>
              <p className="text-muted-foreground">Support for PHP&apos;s Serializable interface with custom class mapping</p>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold mb-3">Type Safety</h3>
              <p className="text-muted-foreground">TypeScript support with strict type checking and comprehensive type definitions</p>
            </div>
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold mb-3">Encoding Options</h3>
              <p className="text-muted-foreground">Flexible encoding options with support for both UTF-8 and binary data</p>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Getting Started</h2>

          {/* Installation */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4">Installation</h3>
            <p className="text-muted-foreground mb-4">Choose your preferred package manager:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="font-semibold mb-2 text-sm">npm</p>
                <code className="font-mono text-sm block">$ npm install php-serialize</code>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="font-semibold mb-2 text-sm">yarn</p>
                <code className="font-mono text-sm block">$ yarn add php-serialize</code>
              </div>
            </div>
          </div>

          {/* Basic Usage */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4">Basic Usage</h3>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
              <code>{`import { serialize, unserialize } from 'php-serialize'

// Serialize data
const data = {
  name: 'John Doe',
  age: 30,
  hobbies: ['reading', 'coding']
}
const serialized = serialize(data)

// Unserialize data
const unserialized = unserialize(serialized)
console.log(unserialized) // Original object`}</code>
            </pre>
          </div>
        </div>

        {/* Examples Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Examples</h2>

          {/* Serializable Objects Example */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4">Serializable Objects</h3>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
              <code>{`class User {
  constructor({ name, age }) {
    this.name = name
    this.age = age
  }
  serialize() {
    return JSON.stringify({ name: this.name, age: this.age })
  }
  unserialize(rawData) {
    const { name, age } = JSON.parse(rawData)
    this.name = name
    this.age = age
  }
}

const user = new User({ name: 'Steel Brain', age: 17 })
const serialized = serialize(user)

// Unserialize with class mapping
const unserialized = unserialize(serialized, { User })
console.log(unserialized instanceof User) // true`}</code>
            </pre>
          </div>

          {/* Advanced Usage Example */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4">Advanced Usage</h3>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
              <code>{`// Custom namespace mapping
const serializedForNamespace = serialize(user, {
  'MyApp\\User': User,
})

// Using different encoding options
const binaryData = serialize(data, {}, { encoding: 'binary' })
const utf8Data = serialize(data, {}, { encoding: 'utf8' })

// Strict mode unserialize
const strict = unserialize(serialized, {}, { strict: true })`}</code>
            </pre>
          </div>
        </div>

        {/* Built with Love */}
        <div className="max-w-3xl mx-auto text-center pb-8">
          <p>Made with ❤️ by <a href="https://aneesiqbal.ai/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Anees Iqbal (@steelbrain)</a></p>
        </div>
      </div>
    </div>
  )
}


