const chalk = require('chalk');

const FIRST_COL_WIDTH = 60;

const Formatting = {
  ARROW: '\u27F6',
  CHECKMARK: '\u2714',
}
class PrintHelper {

  printOK() {
    console.log(chalk.greenBright(`Nothing to cache bust: ${Formatting.CHECKMARK}`))
  }

  printNeedCacheBust(isWebpack) {
    if (isWebpack) {
      console.log(chalk.underline.red(`You need to cache bust the following webpack entry points:\n`));
    } else {
      console.log(chalk.underline.red(`You need to cache bust the following javascript files:\n`));
    }
  }

  printShouldFetchLatest(missingImport) {
    console.log(chalk.underline.yellow('Note: '), `If you're seeing things you didn't change, try pulling the latest from master \n`);
  }

  printMissingImport(importsFound, key) {
    let output = chalk.magenta(key);
    for (var i = key.length + 2; i < FIRST_COL_WIDTH; i ++) {
      output = `${output} `;
    }
    output = `${output}${Formatting.ARROW}     `
    const importSet = new Set(importsFound[key])
    const setIterator = importSet.entries();
    let entry = setIterator.next();
    while(!entry.done) {
      output = `${output} ${entry.value[0]}`
      entry = setIterator.next();
      if (!entry.done) output = `${output}, `;
    }
    console.log(output)
  }

  printImportResults(imports, isWebpack) {
    if (Object.keys(imports).length !== 0) {
      this.printNeedCacheBust(isWebpack);

      Object.keys(imports).forEach((key) => {
        this.printMissingImport(imports, key)
      });
    }
    console.log('\n');
  }

  printResults(importsFound, nonWebpackImportsFound) {
    if (Object.keys(importsFound).length === 0 && Object.keys(nonWebpackImportsFound).length === 0) {
      this.printOK();
    } else {
      this.printImportResults(importsFound, true)
      this.printImportResults(nonWebpackImportsFound, false);
      this.printShouldFetchLatest();
    }
  }
}

module.exports = {PrintHelper};
