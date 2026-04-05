export function interpolateParams(value: any, stateData: Record<string, any>, trace = false): any {
  if (trace) {
    console.log("Interpolating value:", value);
    console.log("Current state data:", stateData);
  }
  if (typeof value === "string") {
    return value.replace(/{{(.*?)}}/g, (_, key) => {
      const trimmed = key.trim();

      if (trace) {
        console.log(`Interpolating key: '${trimmed}'`);
      }

      const split = trimmed.split(".");
      // if split is ["location","lat"] we want to access stateData["location"]["lat"]
      let current: any = stateData;
      console.log(`Interpolating key: '${trimmed}' with split:`, split);
      console.log(`Current state data before interpolation:`, stateData);
      for (const part of split) {
        if (!(part in current)) {
          throw new Error(`Interpolation error: state variable '${part}' not found in '${current}'`);
        }
        current = current[part];
      }
      return current;

      // if (!(trimmed in stateData)) {
      //   throw new Error(`Interpolation error: state variable '${trimmed}' not found`);
      // }

      // return stateData[trimmed];
    });
  }

  if (Array.isArray(value)) {
    if (trace) {
      console.log("Interpolating array:", value);
    }
    return value.map(v => interpolateParams(v, stateData, trace));
  }

  if (typeof value === "object" && value !== null) {
    const result: Record<string, any> = {};

    for (const [k, v] of Object.entries(value)) {
      result[k] = interpolateParams(v, stateData, trace);
    }
    if (trace) {
      console.log("Interpolated object:", result);
    }

    return result;
  }

  return value;
}