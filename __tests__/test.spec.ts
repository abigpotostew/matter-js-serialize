import {Bodies, Composite, Composites, Engine, World} from "matter-js";
import {deserializeWorld, serializeWorld} from "../src";

describe('Test', () => {
  it('should serialize empty world', () => {
    const engine = Engine.create()
    const world = engine.world;

    const serialized = serializeWorld(world)
    const deserialized = deserializeWorld(serialized)

    mergeWorldAndCompare(world, deserialized)
  });
  it('should serialize world with one body', () => {
    const engine = Engine.create()
    const world = engine.world;
    const circle = Bodies.circle(0, 0, 10)
    World.add(world, circle)

    const serialized = serializeWorld(world)
    const deserialized = deserializeWorld(serialized)

    mergeWorldAndCompare(world, deserialized)
  });
  it('should serialize world with one composite', () => {
    const engine = Engine.create()
    const world = engine.world;
    const composite = Composites.stack(0, 0, 2, 2, 100, 100, (x, y, column, row, lastBody, i) => {
      return Bodies.circle(x, y, 10)
    })
    World.add(world, composite)

    const serialized = serializeWorld(world)
    const deserialized = deserializeWorld(serialized)

    removeCache(world)
    expect(deserialized).toEqual(world)
    mergeWorldAndCompare(world, deserialized)
  });
})

const removeCache = (world: World) => {

  Composite.allComposites(world).forEach((composite) => {
    // @ts-ignore
    composite.cache = {}
  })
  // @ts-ignore
  world.cache = {}
}

const mergeWorldAndCompare = (originalWorld: World, deserializedWorld: World) => {
  removeCache(originalWorld)
  expect(deserializedWorld).toEqual(originalWorld)

  const engine = Engine.create()
  const newWorld = engine.world;
  Composite.clear(engine.world, false, true);
  // @ts-ignore
  Engine.merge(engine, {
    world: deserializedWorld
  });
  removeCache(newWorld)
  removeCache(deserializedWorld)
  expect(newWorld).toEqual(deserializedWorld)
}