/* Node 冒烟测试：6 套主题 × 全要素样例文章 → 校验器必须全绿 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = dom.window;
global.DOMParser = dom.window.DOMParser;

const Themes = require('./themes.js');
const Converter = require('./converter.js');
const Validator = require('./validator.js');

const md = fs.readFileSync(path.join(__dirname, 'assets/sample-article.md'), 'utf8');
const tokens = Converter.parse(md);
console.log('tokens: ' + tokens.map(function (t) { return t.type; }).join(','));

let fail = false;
for (const spec of Themes.SPECS) {
  const html = Themes.render(tokens, spec, { author: '张三' });
  const v = Validator.validate(html);
  const status = v.ok ? 'PASS' : 'FAIL';
  console.log(status + ' ' + spec.id.padEnd(8) + ' len=' + html.length
    + (v.errors.length ? ' errors=' + JSON.stringify(v.errors) : '')
    + (v.warnings.length ? ' warnings=' + JSON.stringify(v.warnings) : ''));
  if (!v.ok) fail = true;
}

const html0 = Themes.render(tokens, Themes.getSpec('ocean'), { author: '张三' });
const counts = {
  leafSpans: (html0.match(/leaf=""/g) || []).length,
  keywordUnderline: (html0.match(/border-bottom:2px solid/g) || []).length,
  sections: (html0.match(/CHAPTER|PRACTICE|SUMMARY/g) || []).length,
  codeBlocks: (html0.match(/FF5F57/g) || []).length,
  tables: (html0.match(/<table/g) || []).length,
  images: (html0.match(/<img /g) || []).length
};
console.log('sanity:', JSON.stringify(counts));
if (counts.leafSpans < 30 || counts.keywordUnderline < 3) { console.log('SANITY FAIL'); fail = true; }

/* 无 H1 / 空输入兜底 */
const bare = Themes.render(Converter.parse('只有一段正文，**测试**兜底。'), Themes.getSpec('sakura'), {});
console.log('fallback-cover ' + (Validator.validate(bare).ok ? 'PASS' : 'FAIL'));

process.exit(fail ? 1 : 0);
