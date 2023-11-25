[![npm version](https://badge.fury.io/js/matter-js-serialize.svg)](https://badge.fury.io/js/matter-js-serialize)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/abigpotostew/matter-js-serialize/blob/main/LICENSE)

# matter-js-serialize

A serialization library for the [matter-js](https://brm.io/matter-js/) physics engine.

## Install
    
```bash
npm install matter-js-serialize
```

```bash
yarn add matter-js-serialize
```

## Features
* Serialize a matter js world into a string
* Deserialize a matter js world from a serialized string

## Usage

```typescript

import { serializeWorld, serializeWorld } from matter-js-serialize';
import { Engine, Composite } from 'matter-js';

const engine = Engine.create()

// ... add bodies, constraints, etc.

// this is a string that can be saved to a file or sent over the network
const serializedWorld = serializeWorld(engine.world);

// later, deserialize the world
const world = deserializeWorld(serializedWorld);

// Clear the world, removing all existing bodies, constraints, etc.
Composite.clear(engine.world, false, true);
// merge the deserialized world into the engine
// @ts-ignore
Engine.merge(engine, {
  world: world
});
```

## API

### serializeWorld(world: World): string
Serialize a matter-js world into a string.

### deserializeWorld(serializedWorld: string): World
Deserialize a matter-js world from a serialized string.


## Compression
A serialized world is a JSON string and can be large for large world. This library does not do compression.

Any compression lib can be used on the result of `serializeWorld`. I recommend [lz-string](https://github.com/pieroxy/lz-string).

```typescript
import { serializeWorld } from 'matter-js-serialize';
import { compress, decompress } from 'lz-string';

const serializedWorld = serializeWorld(engine.world);
const compressedWorld = compress(serializedWorld);
const decompressedWorld = decompress(compressedWorld);
```

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm run test
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
