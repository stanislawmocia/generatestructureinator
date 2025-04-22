#!/usr/bin/env node
// structure-generator.js

const fs = require('fs');
const path = require('path');

// --- Configuration ---
// Number of spaces per indentation level in the input file
const SPACES_PER_INDENT = 2;
// Path to the structure definition file (retrieved from the first command line argument)
const structureFilePath = process.argv[2];
// Base directory in which the structure should be created (default is current working directory '.')
const baseDir = process.argv[3] || '.';
// --- End of Configuration ---

if (!structureFilePath) {
  console.error('Error: No path to structure file provided!');
  console.log('Usage: scaffold <path_to_structure_file> [target_directory]');
  process.exit(1); // Exit with error code
}

// Resolve the path to the structure file relative to the current working directory
const resolvedStructurePath = path.resolve(process.cwd(), structureFilePath);
const resolvedBaseDir = path.resolve(process.cwd(), baseDir);

if (!fs.existsSync(resolvedStructurePath)) {
  console.error(`Error: Structure file "${resolvedStructurePath}" does not exist!`);
  process.exit(1);
}

console.log(`Reading structure from file: ${resolvedStructurePath}`);
console.log(`Creating structure in directory: ${resolvedBaseDir}`);

const structureText = fs.readFileSync(resolvedStructurePath, 'utf8');
const lines = structureText.split('\n').filter(line => line.trim() !== ''); // Remove empty lines

const pathStack = []; // Stack storing parent paths

lines.forEach(line => {
  const indentMatch = line.match(/^ */);
  const indentLevel = indentMatch ? indentMatch[0].length / SPACES_PER_INDENT : 0;
  const name = line.trim();

  // Adjust the path stack to the current indentation level
  while (indentLevel < pathStack.length) {
    pathStack.pop();
  }

  // Create paths relative to the base directory (resolvedBaseDir)
  const parentPath = path.join(resolvedBaseDir, ...pathStack);
  const currentItemName = name.endsWith('/') ? name.slice(0, -1) : name; // Remove '/' from the end, if present
  const currentFullPath = path.join(parentPath, currentItemName);

  // Check if it's a file or directory
  const isDirectory = name.endsWith('/') || path.extname(name) === '';

  try {
    if (isDirectory) {
      if (!fs.existsSync(currentFullPath)) {
        fs.mkdirSync(currentFullPath);
        console.log(`✅ Created directory: ${currentFullPath}`);
      } else {
        console.log(`🆗 Directory already exists: ${currentFullPath}`);
      }
      // Add the current directory to the stack for subsequent nested elements
      pathStack.push(currentItemName);
    } else {
      // Make sure the parent directory exists
      if (!fs.existsSync(parentPath)) {
         fs.mkdirSync(parentPath, { recursive: true });
         console.warn(`⚠️ Created missing parent directory: ${parentPath}`);
      }

      if (!fs.existsSync(currentFullPath)) {
        fs.writeFileSync(currentFullPath, ''); // Create an empty file
        console.log(`✅ Created file:    ${currentFullPath}`);
      } else {
        console.log(`🆗 File already exists:   ${currentFullPath}`);
      }
      // Files don't change the path stack
    }
  } catch (error) {
    console.error(`❌ Error while creating "${currentFullPath}": ${error.message}`);
    // You can decide whether to continue or stop (process.exit(1))
  }
});

console.log('\n🎉 Structure creation completed.');
