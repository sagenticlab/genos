/**
 * GenOS Function: checkExit
 */

export async function checkExit(...args) {
  console.log("Function checkExit called with:", args);

  const [query] = args;

  return query.trim().toLowerCase() === "exit" || query.trim().toLowerCase() === "quit" ? 'exit' : 'continue';
}
