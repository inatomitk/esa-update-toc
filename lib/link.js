class Link {
  parse(text) {
    const linkMatch = text.match(/\[(.*)\]\((.*)\)/);
    this.text = linkMatch[1];
    this.linkUrl = linkMatch[2];
  }

  compose() {
    return ` - [${this.text}](${this.linkUrl})`;
  }
}

module.exports = Link;

