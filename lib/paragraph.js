const Body = require('./body');
const Heading = require('./heading');

class Paragraph extends Body {
  constructor(parentDirectory, headingLevel) {
    super(parentDirectory);
    this.headingLevel = headingLevel;
    this.heading = new Heading(headingLevel);
  }

  parse(text) {
    const lines = text.replace(/\r/g, '').split('\n');
    this.heading.parse(lines.shift());
    super.parse(lines.join('\n'));
  }

  compose() {
    const headingText = this.heading.compose();
    return headingText + '\n' + super.compose();
  }

  generateHeadingLink() {
    this.heading.linkUrl = encodeURI(`#path=${this.directory}`);
  }

  get directoryName() {
    return this.heading.text + '/';
  }
}

module.exports = Paragraph;
