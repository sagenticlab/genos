import fs from 'fs';
export function fileReader(fileName: string) {
  // read file content and return as string
  console.log(`Reading file: ${fileName}`);
  return fs.readFileSync(fileName, 'utf-8');
}