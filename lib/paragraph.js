const Body = require('./body');
const Heading = require('./heading');

class Paragraph extends Body {
  constructor(headingLevel) {
    super();
    this.headingLevel = headingLevel;
  }

  parse(text) {
    const lines = text.replace(/\r/g, '').split('\n');
    this.heading = new Heading(this.headingLevel);
    this.heading.parse(lines.shift());
    super.parse(lines.join('\n'));
  }

  compose() {
    const headingText = this.heading.compose();
    return headingText + '\n' + super.compose();
  }

  get posts() {

  }

  get flowSearchLink() {

  }
}

module.exports = Paragraph;
