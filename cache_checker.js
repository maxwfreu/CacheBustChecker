const fs = require('fs');
const { PrintHelper } = require('./utils');

const { whybundled } = require("./whybundled/cli");

const gitDiffFilename = process.argv[2];
const importsFound = {};

const ph = new PrintHelper();

const addToImports = (key, filename) => {
  if (importsFound[key]) {
    importsFound[key].push(filename);
  } else {
    importsFound[key] = [filename];
  }
};

// Read files that have changed
const readGitDiff = () => {
  const {modules, chunks} = whybundled('stats.json');
  fs.readFileSync(gitDiffFilename).toString().split('\n').forEach((changedFilePath) => {
    const strippedChangedFilePath = changedFilePath.replace(/ /g, '');
    if (!strippedChangedFilePath.length) return;
    if (strippedChangedFilePath.indexOf('tests') !== -1) return;
    const module = modules[`./${strippedChangedFilePath}`];
    if (module) {
      module.chunks.forEach(chunk => {
        addToImports(chunks[chunk].names[0], strippedChangedFilePath)
      })
    } else if (strippedChangedFilePath.endsWith('.js')) {
      // TODO: Handle javascript files outside of webpack bundle
      // Example: onboardingTour.js
    }
  });
};

readGitDiff();
ph.printResults(importsFound);

// TODO: Automatically cache bust stuff for you
// TODO: Configure to run on commit hook ?
// TODO: Run as part of travis build ?