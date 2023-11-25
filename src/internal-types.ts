import {Body, Composite, Constraint} from "matter-js";

export type CompositeSerializable =
    Omit<Composite, 'parent' | 'cache' | 'bodies' | 'constraints' | 'composites'>
    & {
  parent: number;
  cache: Record<never, never>
  bodies: BodySerializable[];
  constraints: ConstraintSerializable[];
  composites: CompositeSerializable[];
}

//a clone because matter-js does not expose this
export type Vertice = { x: number, y: number, index: number, body: Body | null, isInternal: boolean }
//parent is the id of the parent body
export type VerticeSerializable = Omit<Vertice, 'body'> & { body: SerializeData | null }
export type BodySerializable = Omit<Body, 'parent' | 'parts' | 'vertices'> & {
  parent: BodySerializable;
  parts: BodySerializable[];
  vertices: VerticeSerializable[];
}
export type ConstraintSerializable = Omit<Constraint, 'bodyA' | 'bodyB'> & {
  bodyA: BodySerializable;
  bodyB: BodySerializable;
}

export type SerializeData = {
  bodiesById: Record<number, BodySerializable>;
  constraintsById: Record<number, ConstraintSerializable>;
  compositesById: Record<number, CompositeSerializable>;
}
