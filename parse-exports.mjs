import ts from 'typescript';
import fs from 'fs';
import path from 'path';

const dir = './components/ui';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
let out = '';

for (const file of files) {
  if (file === 'index.tsx' || file === 'index.ts') continue;
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
  
  const exportsSet = new Set();
  const typesSet = new Set();

  ts.forEachChild(sourceFile, node => {
    let isExport = false;
    if (node.modifiers) {
      for (const mod of node.modifiers) {
        if (mod.kind === ts.SyntaxKind.ExportKeyword) isExport = true;
      }
    }

    if (isExport) {
      if (ts.isVariableStatement(node)) {
        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name)) exportsSet.add(decl.name.text);
        }
      } else if (ts.isFunctionDeclaration(node) && node.name) {
        exportsSet.add(node.name.text);
      } else if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
        typesSet.add(node.name.text);
      }
    }
    
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const spec of node.exportClause.elements) {
        if (node.isTypeOnly || spec.isTypeOnly) {
            typesSet.add(spec.name.text);
        } else {
            exportsSet.add(spec.name.text);
        }
      }
    }
  });

  const basename = file.replace(/\.tsx?$/, '');
  const all = [];
  
  for (const t of typesSet) all.push(`type ${t}`);
  for (const e of exportsSet) {
    if (!typesSet.has(e)) all.push(e);
  }

  if (all.length > 0) {
    out += `export { ${all.join(', ')} } from "./${basename}";\n`;
  }
}

fs.writeFileSync('./components/ui/index.ts', out);
console.log("Done generating index.ts");
