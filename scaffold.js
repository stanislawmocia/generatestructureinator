#!/usr/bin/env node
// create-structure.js

const fs = require('fs');
const path = require('path');

// --- Konfiguracja ---
// Liczba spacji na poziom wcięcia w pliku wejściowym
const SPACES_PER_INDENT = 2;
// Ścieżka do pliku z definicją struktury (pobierana z pierwszego argumentu linii komend)
const structureFilePath = process.argv[2];
// Katalog bazowy, w którym struktura ma być utworzona (domyślnie bieżący katalog roboczy '.')
const baseDir = process.argv[3] || '.';
// --- Koniec Konfiguracji ---

if (!structureFilePath) {
  console.error('Błąd: Nie podano ścieżki do pliku ze strukturą!');
  console.log('Użycie: scaffold <ścieżka_do_pliku_struktury> [katalog_docelowy]');
  process.exit(1); // Zakończ z kodem błędu
}

// Rozwiąż ścieżkę do pliku struktury względem bieżącego katalogu roboczego
const resolvedStructurePath = path.resolve(process.cwd(), structureFilePath);
const resolvedBaseDir = path.resolve(process.cwd(), baseDir);

if (!fs.existsSync(resolvedStructurePath)) {
  console.error(`Błąd: Plik struktury "${resolvedStructurePath}" nie istnieje!`);
  process.exit(1);
}

console.log(`Odczytywanie struktury z pliku: ${resolvedStructurePath}`);
console.log(`Tworzenie struktury w katalogu: ${resolvedBaseDir}`);

const structureText = fs.readFileSync(resolvedStructurePath, 'utf8');
const lines = structureText.split('\n').filter(line => line.trim() !== ''); // Usuń puste linie

const pathStack = []; // Stos przechowujący ścieżki nadrzędne

lines.forEach(line => {
  const indentMatch = line.match(/^ */);
  const indentLevel = indentMatch ? indentMatch[0].length / SPACES_PER_INDENT : 0;
  const name = line.trim();

  // Dostosuj stos ścieżek do aktualnego poziomu wcięcia
  while (indentLevel < pathStack.length) {
    pathStack.pop();
  }

  // Twórz ścieżki względem katalogu bazowego (resolvedBaseDir)
  const parentPath = path.join(resolvedBaseDir, ...pathStack);
  const currentItemName = name.endsWith('/') ? name.slice(0, -1) : name; // Usuń '/' z końca, jeśli jest
  const currentFullPath = path.join(parentPath, currentItemName);

  // Sprawdź, czy to plik czy katalog
  const isDirectory = name.endsWith('/') || path.extname(name) === '';

  try {
    if (isDirectory) {
      if (!fs.existsSync(currentFullPath)) {
        fs.mkdirSync(currentFullPath);
        console.log(`✅ Utworzono katalog: ${currentFullPath}`);
      } else {
        console.log(`🆗 Katalog już istnieje: ${currentFullPath}`);
      }
      // Dodaj aktualny katalog do stosu dla kolejnych zagnieżdżonych elementów
      pathStack.push(currentItemName);
    } else {
      // Upewnij się, że katalog nadrzędny istnieje
      if (!fs.existsSync(parentPath)) {
         fs.mkdirSync(parentPath, { recursive: true });
         console.warn(`⚠️ Utworzono brakujący katalog nadrzędny: ${parentPath}`);
      }

      if (!fs.existsSync(currentFullPath)) {
        fs.writeFileSync(currentFullPath, ''); // Utwórz pusty plik
        console.log(`✅ Utworzono plik:    ${currentFullPath}`);
      } else {
        console.log(`🆗 Plik już istnieje:   ${currentFullPath}`);
      }
      // Pliki nie zmieniają stosu ścieżek
    }
  } catch (error) {
    console.error(`❌ Błąd podczas tworzenia "${currentFullPath}": ${error.message}`);
    // Możesz zdecydować, czy kontynuować, czy przerwać (process.exit(1))
  }
});

console.log('\n🎉 Zakończono tworzenie struktury.');
