const Item = require('./item');
const Link = require('./link');
const config = require('config');

class Body {
  constructor(parentDirectory) {
    this.headingLevel = 0;
    this.parentDirectory = this._formatDirectory(parentDirectory);
    this.childParagraphs = [];
    this.items = [];
    this.links = [];
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
      if(lastChildParagraphText) {
        childParagraphTexts[childParagraphTexts.length - 1] = `${lastChildParagraphText}\n${line}`;
        continue;
      }
      if(this._isItemLine(line)) {
        itemTexts.push(line);
        continue;
      }
      if(this._isLinkLine(line)) {
        linkTexts.push(line);
        continue;
      }
    }
    this.childParagraphs = childParagraphTexts.map(x => {
      const para = new Paragraph(this.directory, this.childHeadingLevel);
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

  addPost(name, url) {
    name = this._formatPostName(name);
    if(name.indexOf(this.directory) !== 0) {
      throw new Error('Directory does not match.');
    }
    const restName = name.replace(this.directory, '');
    if(restName.indexOf('/') < 0) {
      const item = new Item();
      item.text = restName;
      item.linkUrl = url
      this.items.push(item);
      return item;
    }
    for(let i=0; i<this.childParagraphs.length; i++) {
      if(name.indexOf(this.childParagraphs[i].directory) === 0) {
        return this.childParagraphs[i].addPost(name, url);
      }
    }
    const Paragraph = require('./paragraph');
    const para = new Paragraph(this.directory, this.childHeadingLevel);
    const childDirectoryName = restName.match(/^([^\/]*)\//)[1];
    para.heading.text = childDirectoryName;
    para.generateHeadingLink();
    this.childParagraphs.push(para);
    return para.addPost(name, url);
  }

  get childHeadingLevel() {
    return this.headingLevel + 1;
  }

  get directoryName() {
    return '';
  }

  get directory() {
    return this.parentDirectory + this.directoryName;
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
    return /\[.*\]\(.*\)/.test(line);
  }

  _formatDirectory(directory) {
    if(directory.slice(-1) !== '/') {
      directory += '/';
    }
    if(directory.slice(0, 1) !== '/') {
      directory = '/' + directory;
    }
    return directory;
  }

  _formatPostName(name) {
    if(name.slice(0, 1) !== '/') {
      name = '/' + name;
    }
    return name;
  }
}

module.exports = Body;
