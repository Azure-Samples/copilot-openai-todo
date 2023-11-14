import fs from 'node:fs/promises';

const targetPath = './dist';
const replacements = [
  { key: '$SERVER_API_URL', value: process.env.SERVER_API_URL ?? '' },
]

async function replaceInFile(filePath) {
  let fileContent = await fs.readFile(filePath, 'utf8');
  replacements.forEach(replacement => {
    fileContent = fileContent.replace(replacement.key, replacement.value);
  });
  await fs.writeFile(filePath, fileContent);
}

async function replaceInFiles(dirPath) {
  const files = await fs.readdir(dirPath);
  for (const file of files) {
    const filePath = `${dirPath}/${file}`;
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await replaceInFiles(filePath);
    } else {
      await replaceInFile(filePath);
    }
  }
}

await replaceInFiles(targetPath);
console.log('Environment variables replaced successfully.');
for (const replacement of replacements) {
  console.log(`- ${replacement.key} => ${replacement.value}`);
}
