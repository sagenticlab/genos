export function checkExit(query: any) {
  return query.trim().toLowerCase() === "exit" || query.trim().toLowerCase() === "quit" ? 'exit' : 'continue';
}