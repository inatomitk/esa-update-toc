class Heading {
  constructor(headingLevel) {
    this.headingLevel = headingLevel;
  }

  parse(text) {
    if(this._isLink(text)) {
      const linkMatch = text.match(/\[(.*)\]\((.*)\)/);
      this.text = linkMatch[1];
      this.linkUrl = linkMatch[2];
    } else {
      this.text = text.match(/^\s*#+\s+(.*)$/)[1];
    }
  }

  compose() {
    const headStr = '#'.repeat(this.headingLevel);
    if(this.linkUrl) {
      return `${headStr} [${this.text}](${this.linkUrl})`;
    }
    return `${headStr} ${this.text}`;
  }

  _isLink(text) {
    return /\[.*\]\(.*\)/.test(this.text);
  }
}

module.exports = Heading;
