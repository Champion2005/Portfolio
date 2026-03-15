import { mkdirSync, readdirSync, rmSync, statSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');
const require = createRequire(import.meta.url);
const { compile, isAvailable } = require('node-latex-compiler');

const texPath = join(rootDir, 'src', 'resume_tex', 'resume.tex');
const archiveDir = join(rootDir, 'src', 'resume_tex', 'archive');
const buildDir = join(rootDir, 'src', 'resume_tex', '.build');
const outputPdfPath = join(rootDir, 'public', 'Aditya_Patel_resume.pdf');
const generatedPdfPath = join(buildDir, 'resume.pdf');
const MAX_ARCHIVES = 5;

function ensurePathExists(path, label) {
  if (!existsSync(path)) {
    throw new Error(`${label} not found: ${path}`);
  }
}

function makeTimestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    '-',
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join('');
}

function rotateArchives() {
  mkdirSync(archiveDir, { recursive: true });

  const archiveName = `resume_${makeTimestamp()}.tex`;
  const archivePath = join(archiveDir, archiveName);
  copyFileSync(texPath, archivePath);

  const archiveFiles = readdirSync(archiveDir)
    .filter((file) => file.endsWith('.tex'))
    .map((file) => ({
      file,
      fullPath: join(archiveDir, file),
      modifiedAt: statSync(join(archiveDir, file)).mtimeMs,
    }))
    .sort((a, b) => b.modifiedAt - a.modifiedAt);

  for (const oldFile of archiveFiles.slice(MAX_ARCHIVES)) {
    rmSync(oldFile.fullPath, { force: true });
  }
}

async function compileTexToPdf() {
  mkdirSync(buildDir, { recursive: true });

  if (!isAvailable()) {
    throw new Error('Local TeX compiler is not available. Reinstall dependencies with: npm install');
  }

  const result = await compile({
    texFile: texPath,
    outputDir: buildDir,
    outputFile: generatedPdfPath,
    onStderr: (data) => {
      // Preserve compiler warnings/errors in console output for debugging.
      process.stderr.write(data);
    },
  });

  if (result.status !== 'success') {
    throw new Error(result.error || result.stderr || 'LaTeX compilation failed. Ensure resume.tex is valid.');
  }

  ensurePathExists(generatedPdfPath, 'Generated PDF');
  copyFileSync(generatedPdfPath, outputPdfPath);
}

function cleanupBuildArtifacts() {
  const extensionsToRemove = ['.aux', '.log', '.out', '.toc', '.pdf'];
  const baseName = 'resume';

  for (const extension of extensionsToRemove) {
    const filePath = join(buildDir, `${baseName}${extension}`);
    rmSync(filePath, { force: true });
  }
}

async function main() {
  ensurePathExists(texPath, 'TeX source file');

  rotateArchives();
  await compileTexToPdf();
  cleanupBuildArtifacts();

  console.log('Resume PDF updated at public/Aditya_Patel_resume.pdf');
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
