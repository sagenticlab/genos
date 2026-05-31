export const FUNCTIONS = [
  {
    name: 'checkExit',
    description: 'Checks if the input query is an exit command.',
    body: async (query: any) => {
      return query.trim().toLowerCase() === "exit" ? 'exit' : 'continue';
    }
  }
];