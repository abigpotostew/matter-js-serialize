/**
 * Deserialize a world from a string. This doesn't actually check if the type of the deserialized string is a world.
 * @param serialized a serialized world from `serializeWorld`
 */
export const deserializeWorld = (serialized: string): Matter.World => {
  return parseRefJSON(serialized)
}

/** @internal */
function parseRefJSON(json: string) {
  let objToPath = new Map();
  let pathToObj = new Map();
  let o = JSON.parse(json);

  let traverse = (parent: any, field?: any) => {
    let obj = parent;
    let path = '#REF:$';

    if (field !== undefined) {
      obj = parent[field];
      path = objToPath.get(parent) + (Array.isArray(parent) ? `[${field}]` : `${field ? '.' + field : ''}`);
    }

    objToPath.set(obj, path);
    pathToObj.set(path, obj);

    let ref = pathToObj.get(obj);
    if (ref) parent[field] = ref;

    for (let f in obj) if (obj === Object(obj)) traverse(obj, f);
  }

  traverse(o);
  return o;
}