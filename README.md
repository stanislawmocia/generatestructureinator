# GenerateStructureinator
A simple CLI tool that generates file and directory structures based on a text file definition.

# Installation
Global Installation
```npm install -g generatestructureinator```
Local Installation
```npm install generatestructureinator```
Usage
```generatestructureinator <structure-file-path> [target-directory]```

- `<structure-file-path>`: Path to the file containing your structure definition (required)
- `[target-directory]`: Directory where the structure should be created (optional, defaults to current directory)

# Example
Create a structure definition file (e.g., example-structure.txt):
```
.gitignore
.env.example
package.json
tsconfig.json
src/
  main.ts
  app.module.ts
  email/
    email.module.ts
    email.service.ts
```

Run the command:
```generatestructureinator example-structure.txt my-project```

This will create the following structure:

```
my-project/
├── .gitignore
├── .env.example
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts
    ├── app.module.ts
    └── email/
        ├── email.module.ts
        └── email.service.ts
```

# Structure File Format
- Each line represents a file or directory
- Indentation (2 spaces) indicates nesting
- Lines ending with / are explicitly treated as directories
- Lines with no file extension are treated as directories
- Empty lines are ignored

# Features
- Creates nested directory structures
- Creates empty files
- Skips creation of files and directories that already exist
- Creates parent directories as needed
- Provides visual feedback with emoji indicators

# License
ISC

# Author
Stanisław Mocia