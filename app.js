/* Md2GZH 前端应用：实时转换 + 预览 + 一键复制 */
(function () {
  'use strict';

  var Themes = window.Md2GZHThemes;
  var Converter = window.Md2GZHConverter;
  var Validator = window.Md2GZHValidator;

  var editor = document.getElementById('editor');
  var preview = document.getElementById('preview');
  var previewWrap = document.getElementById('previewWrap');
  var themeCards = document.getElementById('themeCards');
  var groupTabs = document.getElementById('groupTabs');
  var validBadge = document.getElementById('validBadge');
  var validPanel = document.getElementById('validPanel');
  var authorInput = document.getElementById('authorInput');
  var toastEl = document.getElementById('toast');

  var state = { themeId: Themes.SPECS[0].id, group: 'all', html: '', timer: null };

  var SAMPLE_MD =
    '# 三分钟，把 Markdown 排成高级感 / 三十三套主题上线\n\n'
    + '> 排版不该消耗创作热情，它应该一键发生。\n\n'
    + '把文章粘进来，选一套主题，点**复制到公众号**，直接粘贴发布。这是专门为公众号作者做的排版工具。\n\n'
    + '## 三步完成排版\n\n'
    + '第一步，粘贴 Markdown；第二步，挑一套顺眼的主题；第三步，复制进公众号编辑器，==样式不丢==。\n\n'
    + '- **加粗**自动升级为关键词下划线\n'
    + '- `行内代码`、代码块、表格、图片全部支持\n'
    + '- 中英文标点自动全角化\n\n'
    + '## 适用场景\n\n'
    + '教程、测评、随笔、周报，凡是要发公众号的文章都合适。**深色代码块**对技术文尤其友好：\n\n'
    + '```bash\nnpm run build\n# 粘贴到公众号后缩进不乱\n```\n\n'
    + '> 好排版让读者只关注内容本身。\n\n'
    + '现在就试试：清空本文，粘入你自己的文章。\n';

  /* ---------- 渲染 ---------- */

  function previewShell(html) {
    return '<!DOCTYPE html><html><head><meta charset="utf-8">'
      + '<meta name="viewport" content="width=device-width,initial-scale=1">'
      + '<style>body{margin:0;padding:18px 16px;background:#fff;'
      + 'font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;}'
      + 'img{max-width:100%;}</style></head><body>' + html + '</body></html>';
  }

  function convert() {
    var spec = Themes.getSpec(state.themeId);
    var tokens = Converter.parse(editor.value);
    var html = Themes.render(tokens, spec, { author: authorInput.value.trim() });
    state.html = html;
    preview.srcdoc = previewShell(html);
    var v = Validator.validate(html);
    validBadge.className = 'badge ' + (v.ok ? (v.warnings.length ? 'warn' : 'ok') : 'bad');
    validBadge.textContent = v.ok
      ? (v.warnings.length ? '⚠ ' + v.warnings.length + ' 条建议' : '✓ 平台合规')
      : '✗ ' + v.errors.length + ' 个错误';
    validBadge.dataset.ok = v.ok ? '1' : '0';
    var panelHtml = '';
    v.errors.forEach(function (e) { panelHtml += '<div class="err">✗ ' + e + '</div>'; });
    v.warnings.forEach(function (w) { panelHtml += '<div class="warn">⚠ ' + w + '</div>'; });
    validPanel.innerHTML = panelHtml;
    validPanel.hidden = v.ok && !v.warnings.length;
  }

  function scheduleConvert() {
    clearTimeout(state.timer);
    state.timer = setTimeout(convert, 350);
  }

  /* ---------- 主题分组 + 卡片 ---------- */

  function buildGroupTabs() {
    groupTabs.innerHTML = '';
    Themes.GROUPS.forEach(function (g) {
      var count = g.id === 'all' ? Themes.SPECS.length
        : Themes.SPECS.filter(function (s) { return s.group === g.id; }).length;
      var b = document.createElement('button');
      b.className = 'group-tab' + (state.group === g.id ? ' active' : '');
      b.dataset.group = g.id;
      b.textContent = g.name + ' ' + count;
      b.addEventListener('click', function () {
        state.group = g.id;
        groupTabs.querySelectorAll('.group-tab').forEach(function (t) {
          t.classList.toggle('active', t.dataset.group === g.id);
        });
        buildThemeCards();
      });
      groupTabs.appendChild(b);
    });
  }

  function buildThemeCards() {
    themeCards.innerHTML = '';
    Themes.SPECS.filter(function (s) {
      return state.group === 'all' || s.group === state.group;
    }).forEach(function (spec, i) {
      var card = document.createElement('button');
      card.className = 'theme-card rise' + (spec.id === state.themeId ? ' active' : '');
      card.style.animationDelay = (0.16 + i * 0.035) + 's';
      card.dataset.id = spec.id;
      card.innerHTML = '<span class="swatch" style="background:' + spec.swatch + '"></span>'
        + '<span class="tname">' + spec.name + '</span>'
        + '<span class="tdesc">' + spec.desc + '</span>';
      card.addEventListener('click', function () {
        state.themeId = spec.id;
        themeCards.querySelectorAll('.theme-card').forEach(function (c) {
          c.classList.toggle('active', c.dataset.id === spec.id);
        });
        convert();
      });
      themeCards.appendChild(card);
    });
  }

  /* ---------- 复制 / 下载 ---------- */

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.hidden = true; }, 2200);
  }

  function fallbackCopy() {
    var box = document.createElement('div');
    box.contentEditable = 'true';
    box.innerHTML = state.html;
    box.style.position = 'fixed';
    box.style.left = '-9999px';
    document.body.appendChild(box);
    var range = document.createRange();
    range.selectNodeContents(box);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand('copy');
    sel.removeAllRanges();
    document.body.removeChild(box);
  }

  function copyToWechat() {
    if (!state.html) { toast('先粘贴一点内容再复制'); return; }
    var plain = new Blob([Converter.plainText(editor.value)], { type: 'text/plain' });
    var rich = new Blob([state.html], { type: 'text/html' });
    if (navigator.clipboard && window.ClipboardItem) {
      navigator.clipboard.write([new ClipboardItem({ 'text/html': rich, 'text/plain': plain })])
        .then(function () { toast('✓ 已复制，去公众号编辑器 ⌘/Ctrl+V 粘贴'); })
        .catch(function () { fallbackCopy(); toast('✓ 已复制（兼容模式）'); });
    } else {
      fallbackCopy();
      toast('✓ 已复制（兼容模式）');
    }
  }

  function download() {
    if (!state.html) { toast('先粘贴一点内容'); return; }
    var spec = Themes.getSpec(state.themeId);
    var title = (editor.value.match(/^#\s*(.+)$/) || [])[1] || '文章';
    var name = title.trim().replace(/[\\/:*?"<>| ]/g, '_').slice(0, 30);
    var blob = new Blob(['\ufeff' + state.html], { type: 'text/html;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '_排版_' + spec.name + '(' + spec.id + ').html';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ---------- 事件 ---------- */

  editor.addEventListener('input', scheduleConvert);
  authorInput.addEventListener('input', scheduleConvert);
  document.getElementById('btnCopy').addEventListener('click', copyToWechat);
  document.getElementById('btnDownload').addEventListener('click', download);
  document.getElementById('btnSample').addEventListener('click', function () {
    editor.value = SAMPLE_MD;
    convert();
  });
  document.getElementById('btnClear').addEventListener('click', function () {
    editor.value = '';
    convert();
    editor.focus();
  });
  document.getElementById('widthFit').addEventListener('click', function () {
    previewWrap.classList.remove('phone');
    this.classList.add('active');
    document.getElementById('widthPhone').classList.remove('active');
  });
  document.getElementById('widthPhone').addEventListener('click', function () {
    previewWrap.classList.add('phone');
    this.classList.add('active');
    document.getElementById('widthFit').classList.remove('active');
  });
  validBadge.addEventListener('click', function () {
    validPanel.hidden = !validPanel.hidden;
  });

  /* ---------- 启动 ---------- */
  var stripNote = document.getElementById('stripNote');
  if (stripNote) {
    stripNote.textContent = Themes.SPECS.length + ' Themes · ' + (Themes.GROUPS.length - 1) + ' Collections';
  }
  buildGroupTabs();
  buildThemeCards();
  editor.value = SAMPLE_MD;
  convert();
})();
