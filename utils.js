const Formatting = {
  UNDERLINE: '\x1b[4m',
  ARROW: '\u27F6',
  CHECKMARK: '\u2714',
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
}

const Colors = {
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  GREEN: '\x1b[32m',
}

const Messages = {
  NEED_TO_CACHE_BUST: `\n${Formatting.BRIGHT}You need to cache bust the following:\n`,
  NO_CACHE_BUST: `${Formatting.BRIGHT}Nothing to cache bust: ${Formatting.CHECKMARK}`,
  FETCH_LATEST: `\n${Formatting.BRIGHT}Note:${Formatting.RESET} If you're seeing things you didn't change, try pulling the latest from master`,
}

const FIRST_COL_WIDTH = 40;

class PrintHelper {

  print(text) {
    process.stdout.write(text);
  }

  printWithColor(textColor, text, isTitle = false) {
    let color = textColor;
    if(isTitle) {
      color = `\n${Formatting.UNDERLINE}${color}`;
    }
    this.print(`${color}${text}\n`);
  }

  printOK() {
    this.printWithColor(Colors.GREEN, Messages.NO_CACHE_BUST, true);
  }

  printNeedCacheBust() {
    this.printWithColor(Colors.RED, Messages.NEED_TO_CACHE_BUST, true);
  }

  printShouldFetchLatest(missingImport) {
    this.printWithColor(Colors.YELLOW, Messages.FETCH_LATEST);
  }

  printMissingImport(importsFound, key) {
    this.print(`${Formatting.RESET}${Colors.RED}${key}`)
    for (var i = key.length + 2; i < FIRST_COL_WIDTH; i ++) {
      this.print(' ');
    }
    this.print(`${Formatting.RESET}${Formatting.ARROW}     `);
    const importSet = new Set(importsFound[key])
    const setIterator = importSet.entries();
    let entry = setIterator.next();
    while(!entry.done) {
      this.print(` ${entry.value[0]}`);
      entry = setIterator.next();
      if (!entry.done) this.print(`,`);
    }
    this.print('\n');
  }

  printResults(importsFound) {
    if (Object.keys(importsFound).length !== 0) {
      this.printNeedCacheBust();

      Object.keys(importsFound).forEach((key) => {
        this.printMissingImport(importsFound, key)
      });

      this.printShouldFetchLatest();
    } else {
      this.printOK();
    }
  }
}

module.exports = {PrintHelper};
