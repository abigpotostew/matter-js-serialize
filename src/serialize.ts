import * as Matter from "matter-js";
import {
  BodySerializable,
  CompositeSerializable,
  ConstraintSerializable,
  SerializeData,
  Vertice
} from "./internal-types";
import {Body, Composite, Constraint} from "matter-js";

/**
 * Serialize a Matter.World to a string. Filtering out the mouse constraint.
 * @param world a matter world, can be retrieved from `engine.world`
 */
export const serializeWorld = (world: Matter.World): string => {
  const data: SerializeData = {
    bodiesById: {},
    compositesById: {},
    constraintsById: {}
  }
  const out = compositeToSerializable(world, data)

  return JSON.stringify(out, refReplacer());
}
/**
 * Transform a composite to a serializable composite
 * @param composite a composite to serialize
 * @param data a reference to previously serialized data
 */
const compositeToSerializable = <T extends Composite>(composite: T, data: SerializeData): CompositeSerializable => {
  if (data.compositesById[composite.id]) {
    return data.compositesById[composite.id]
  }
  // Assign the ref now so that references to this composite can be resolved later without duplicating this composite.
  const out = {} as CompositeSerializable;
  data.compositesById[composite.id] = out

  const bodies = composite.bodies ? composite.bodies.map((b) => bodyToSerializable(b, data)) : null
  // delete/filter out mouse constraint from world because it doesn't deserialize properly into a constraint.
  const constraints = composite.constraints.filter((c: Constraint) => c.label !== 'Mouse Constraint').map((c) => constraintToSerializable(c, data))
  //recurse on composite children
  Object.assign(out, {
    ...composite,
    // filter out 'cached' field. It will be rebuilt by matter-js.
    cache: {},
    parent: composite.parent ? compositeToSerializable(composite.parent, data) : null,
    bodies,
    constraints,
    composites: composite.composites.map((c) => compositeToSerializable(c, data))
  })
  return out;
}

const bodyToSerializable = (body: Body, data: SerializeData): BodySerializable => {
  if (data.bodiesById[body.id]) {
    return data.bodiesById[body.id]
  }

  // Assign the ref now so that references to this body can be resolved later without duplicating this body.
  const out = {} as BodySerializable;
  data.bodiesById[body.id] = out;
  Object.assign(out, {
    ...body,
    parent: bodyToSerializable(body.parent, data),
    vertices: body.vertices.map((v: Vertice) => ({
      ...v,
      // body is missing from Matter.Vector but is actually present here
      body: v.body ? bodyToSerializable(v.body, data) : null
    })),
    // this should handle the case where the body has multiple parts
    parts: body.parts.map((p) => bodyToSerializable(p, data))
  })
  return out
}
const constraintToSerializable = (constraint: Constraint, data: SerializeData): ConstraintSerializable => {
  if (data.constraintsById[constraint.id]) {
    return data.constraintsById[constraint.id];
  }
  const out: ConstraintSerializable = {} as ConstraintSerializable
  data.constraintsById[constraint.id] = out
  Object.assign(out, {
    ...constraint,
    bodyA: bodyToSerializable(constraint.bodyA, data),
    bodyB: bodyToSerializable(constraint.bodyB, data)
  });
  return out
}

// from https://stackoverflow.com/questions/10392293/stringify-convert-to-json-a-javascript-object-with-circular-reference
function refReplacer() {
  let m = new Map(), v = new Map(), init: any = null;

  // in TypeScript add "this: any" param to avoid compliation errors - as follows
  //    return function (this: any, field: any, value: any) {
  return function (field: any, value: any) {
    let p = m.get(this) + (Array.isArray(this) ? `[${field}]` : '.' + field);
    let isComplex = value === Object(value)

    if (isComplex) m.set(value, p);

    let pp = v.get(value) || '';
    let path = p.replace(/undefined\.\.?/, '');
    let val = pp ? `#REF:${pp[0] == '[' ? '$' : '$.'}${pp}` : value;

    !init ? (init = value) : (val === init ? val = "#REF:$" : 0);
    if (!pp && isComplex) v.set(value, path);

    return val;
  }
}