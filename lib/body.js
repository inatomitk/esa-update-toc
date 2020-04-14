const Item = require('./item');
const Link = require('./link');

class Body {
  constructor(root) {
    this._root = root;
    this.headingLevel = 0;
  }

  parse(text) {
    const Paragraph = require('./paragraph');

    const lines = text.replace(/\r/g, '').split('\n');

    let childParagraphTexts = [];
    let itemTexts = [];
    let linkTexts = [];
    for(let i=0; i<lines.length; i++){
      let line = lines[i];
      if(this._isHeadingLine(line, this.childHeadingLevel)){
        childParagraphTexts.push(line);
        continue;
      }
      let lastChildParagraphText = childParagraphTexts[childParagraphTexts.length - 1];
      if(lastChildParagraphText){
        childParagraphTexts[childParagraphTexts.length - 1] = `${lastChildParagraphText}\n${line}`;
        continue;
      }
      if(this._isItemLine(line)){
        itemTexts.push(line);
        continue;
      }
      linkTexts.push(line);
    }
    this.childParagraphs = childParagraphTexts.map(x => {
      const para = new Paragraph(this.childHeadingLevel);
      para.parse(x);
      return para;
    });
    this.items = itemTexts.map(x => {
      const item = new Item();
      item.parse(x);
      return item;
    });
    this.links = linkTexts.map(x => {
      const link = new Link();
      link.parse(x);
      return link;
    });
  }

  compose() {
    const items = this.items.map(x => x.compose());
    const paras = this.childParagraphs.map(x => x.compose());
    return items.concat(paras).join('\n');
  }

  get childHeadingLevel() {
    return this.headingLevel + 1;
  }

  _isHeadingLine(line, headingLevel) {
    const headingStr = '#'.repeat(headingLevel);
    const pattern = new RegExp(`^\\s*${headingStr}\\s+`);
    return pattern.test(line);
  }

  _isItemLine(line) {
    return /^\s*\-\s+/.test(line);
  }

  _isLinkLine(line) {
    return /\[.*\]\(.*\)/.test(text);
  }
}

module.exports = Body;
