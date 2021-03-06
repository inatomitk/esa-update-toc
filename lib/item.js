class Item {
  parse(text) {
    if(this._isLink(text)) {
      const linkMatch = text.match(/\[(.*)\]\((.*)\)/);
      this.text = linkMatch[1];
      this.linkUrl = linkMatch[2];
    } else {
      this.text = text.match(/^\s*\-\s+(.*)$/)[1];
    }
  }

  compose() {
    if(this.linkUrl) {
      return ` - [${this.text}](${this.linkUrl})`;
    }
    return ` - ${this.text}`;
  }

  _isLink(text) {
    return /\[.*\]\(.*\)/.test(this.text);
  }
}

module.exports = Item;

