/* Yi Tuo Hub 排版工坊前端
 * - 主题选择：工具栏下拉选择器（分组 + 网格）
 * - 动效组件：来自 wechat-motion-layout-studio（蓝梦授权），插入封面下方
 */
(function () {
  'use strict';

  var Themes = window.Md2GZHThemes;
  var Converter = window.Md2GZHConverter;
  var Validator = window.Md2GZHValidator;

  var editor = document.getElementById('editor');
  var preview = document.getElementById('preview');
  var previewWrap = document.getElementById('previewWrap');
  var validBadge = document.getElementById('validBadge');
  var validPanel = document.getElementById('validPanel');
  var authorInput = document.getElementById('authorInput');
  var toastEl = document.getElementById('toast');
  var pickerSlot = document.getElementById('themePickerSlot');
  var motionBtn = document.getElementById('motionBtn');
  var motionCount = document.getElementById('motionCount');

  var state = {
    themeId: Themes.SPECS[0].id,
    group: 'all',
    html: '',
    timer: null,
    motion: [],
    manifest: null,
    motionStyle: null,
    pickerOpen: false
  };

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
      + 'img,svg{max-width:100%;}</style></head><body>' + html + '</body></html>';
  }

  function convert() {
    var spec = Themes.getSpec(state.themeId);
    var tokens = Converter.parse(editor.value);
    var html = Themes.render(tokens, spec, { author: authorInput.value.trim(), motion: state.motion });
    state.html = html;
    preview.srcdoc = previewShell(html);
    var v = Validator.validate(html);
    validBadge.className = 'badge ' + (v.ok ? (v.warnings.length ? 'warn' : 'ok') : 'bad');
    validBadge.textContent = v.ok
      ? (v.warnings.length ? '⚠ ' + v.warnings.length + ' 条建议' : '✓ 平台合规')
      : '✗ ' + v.errors.length + ' 个错误';
    var panelHtml = '';
    v.errors.forEach(function (e) { panelHtml += '<div class="err">✗ ' + e + '</div>'; });
    v.warnings.forEach(function (w) { panelHtml += '<div class="warn">⚠ ' + w + '</div>'; });
    validPanel.innerHTML = panelHtml;
    validPanel.hidden = v.ok && !v.warnings.length;
    if (motionCount) {
      motionCount.hidden = state.motion.length === 0;
      motionCount.textContent = String(state.motion.length);
    }
  }

  function scheduleConvert() {
    clearTimeout(state.timer);
    state.timer = setTimeout(convert, 350);
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.hidden = true; }, 2200);
  }

  /* ---------- 主题下拉选择器 ---------- */

  var pickerBtn, pickerPop;

  function buildPicker() {
    pickerSlot.innerHTML = '';
    pickerBtn = document.createElement('button');
    pickerBtn.className = 'picker-btn';
    pickerBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      state.pickerOpen = !state.pickerOpen;
      pickerPop.hidden = !state.pickerOpen;
    });
    pickerSlot.appendChild(pickerBtn);
    pickerPop = document.createElement('div');
    pickerPop.className = 'picker-pop';
    pickerPop.hidden = true;
    pickerPop.addEventListener('click', function (e) { e.stopPropagation(); });
    pickerSlot.appendChild(pickerPop);
    document.addEventListener('click', function () {
      state.pickerOpen = false;
      pickerPop.hidden = true;
    });
    renderPickerBtn();
    renderPickerPop();
  }

  function renderPickerBtn() {
    var spec = Themes.getSpec(state.themeId);
    pickerBtn.innerHTML = '<span class="swatch" style="background:' + spec.swatch + '"></span>'
      + '<span class="picker-name">' + spec.name + '</span>'
      + '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
  }

  function renderPickerPop() {
    var total = Themes.SPECS.length;
    var groups = Themes.GROUPS.length - 1;
    var h = '<div class="pop-head"><span class="pop-title">THEME COLLECTIONS · 主题库</span>'
      + '<span class="pop-note">' + total + ' THEMES · ' + groups + ' COLLECTIONS</span></div>'
      + '<div class="pop-tabs">';
    Themes.GROUPS.forEach(function (g) {
      var count = g.id === 'all' ? total
        : Themes.SPECS.filter(function (s) { return s.group === g.id; }).length;
      h += '<button class="group-tab' + (state.group === g.id ? ' active' : '') + '" data-group="' + g.id + '">'
        + g.name + ' <span class="cnt">' + count + '</span></button>';
    });
    h += '</div><div class="pop-grid">';
    Themes.SPECS.filter(function (s) {
      return state.group === 'all' || s.group === state.group;
    }).forEach(function (spec) {
      h += '<button class="pop-card' + (spec.id === state.themeId ? ' active' : '') + '" data-id="' + spec.id + '">'
        + '<span class="swatch" style="background:' + spec.swatch + '"></span>'
        + '<span class="pop-card-text"><span class="tname">' + spec.name + '</span>'
        + '<span class="tdesc">' + spec.desc + '</span></span></button>';
    });
    h += '</div>';
    pickerPop.innerHTML = h;
    pickerPop.querySelectorAll('.group-tab').forEach(function (t) {
      t.addEventListener('click', function () {
        state.group = t.dataset.group;
        renderPickerPop();
      });
    });
    pickerPop.querySelectorAll('.pop-card').forEach(function (c) {
      c.addEventListener('click', function () {
        state.themeId = c.dataset.id;
        renderPickerBtn();
        renderPickerPop();
        convert();
        state.pickerOpen = false;
        pickerPop.hidden = true;
      });
    });
  }

  /* ---------- 动效组件（蓝梦 wechat-motion-layout-studio · 已获授权） ---------- */

  var STYLE_META = [
    { id: 'archive-sepia', name: '档案棕褐', swatch: '#8B5B3E' },
    { id: 'blueprint-grid', name: '工程蓝图', swatch: '#2F718C' },
    { id: 'botanical-notes', name: '植物笔记', swatch: '#627A45' },
    { id: 'citrus-report', name: '青柠报告', swatch: '#65731F' },
    { id: 'coral-zine', name: '珊瑚志', swatch: '#B95054' },
    { id: 'deep-sea-terminal', name: '深海终端', swatch: '#17242D' },
    { id: 'editorial-vermilion', name: '朱砂编辑部', swatch: '#B33A2B' },
    { id: 'mist-research', name: '雾感研究', swatch: '#4F7489' },
    { id: 'mono-gold-journal', name: '素金手记', swatch: '#87682F' },
    { id: 'neo-brutal', name: '新粗野', swatch: '#B94A32' },
    { id: 'night-editorial', name: '夜航评论', swatch: '#B95833' },
    { id: 'rice-paper', name: '宣纸', swatch: '#A64232' },
    { id: 'soft-clay', name: '软陶', swatch: '#9F5E45' },
    { id: 'swiss-signal', name: '瑞士信号', swatch: '#3157A4' },
    { id: 'violet-studio', name: '紫罗兰工作室', swatch: '#705B8C' }
  ];
  var ROLE_META = [
    ['title', '主标题'], ['section-title', '章节标题'], ['decor', '装饰'],
    ['frame', '边框'], ['tail', '尾饰']
  ];

  function motionUrl(path) {
    return path.replace('assets/production-motion-v6', 'motion');
  }

  function ensureManifest() {
    if (state.manifest) return Promise.resolve(state.manifest);
    return fetch('motion/manifest.json')
      .then(function (r) { return r.json(); })
      .then(function (m) { state.manifest = m; return m; });
  }

  function componentsOf(styleId) {
    return state.manifest.components.filter(function (c) { return c.style === styleId; });
  }

  function motionFileOf(comp) {
    return comp.motion_file || comp.static_file;
  }

  function styleName(id) {
    for (var i = 0; i < STYLE_META.length; i++) if (STYLE_META[i].id === id) return STYLE_META[i].name;
    return id;
  }
  function roleName(id) {
    for (var i = 0; i < ROLE_META.length; i++) if (ROLE_META[i][0] === id) return ROLE_META[i][1];
    return id;
  }

  function insertMotion(comp) {
    return fetch(motionUrl(motionFileOf(comp)))
      .then(function (r) { return r.text(); })
      .then(function (svg) {
        state.motion.push(svg);
        convert();
        toast('✓ 已插入「' + styleName(comp.style) + ' ' + roleName(comp.role) + '」，位于封面下方');
      });
  }

  function copyMotion(comp) {
    return fetch(motionUrl(motionFileOf(comp)))
      .then(function (r) { return r.text(); })
      .then(function (svg) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(svg).then(function () {
            toast('✓ SVG 已复制到剪贴板');
          });
        } else {
          toast('当前环境不支持复制');
        }
      });
  }

  function openMotionModal() {
    ensureManifest().then(function () {
      if (!state.motionStyle) {
        var cur = Themes.getSpec(state.themeId);
        if (cur.group === 'motion') {
          for (var i = 0; i < STYLE_META.length; i++) {
            if (STYLE_META[i].name === cur.name) state.motionStyle = STYLE_META[i].id;
          }
        }
      }
      if (!state.motionStyle) state.motionStyle = STYLE_META[0].id;
      renderMotionModal();
    });
  }

  function renderMotionModal() {
    var existing = document.getElementById('motionModal');
    if (existing) existing.parentNode.removeChild(existing);
    var modal = document.createElement('div');
    modal.className = 'motion-modal';
    modal.id = 'motionModal';

    var h = '<div class="motion-panel">'
      + '<div class="motion-head"><div>'
      + '<p class="hero-eyebrow">Motion Components · 动效组件库</p>'
      + '<p class="motion-src">来自 蓝梦 wechat-motion-layout-studio · 已获授权 · SMIL 动画，公众号直接支持</p>'
      + '</div><button class="btn icon-round" id="motionClose" aria-label="关闭">✕</button></div>'
      + '<div class="motion-body"><div class="motion-nav">';
    STYLE_META.forEach(function (s) {
      h += '<button class="motion-style' + (s.id === state.motionStyle ? ' active' : '') + '" data-style="' + s.id + '">'
        + '<span class="swatch" style="background:' + s.swatch + '"></span>' + s.name + '</button>';
    });
    h += '</div><div class="motion-grid">';
    componentsOf(state.motionStyle).forEach(function (comp) {
      h += '<div class="motion-card">'
        + '<div class="motion-preview"><img src="' + motionUrl(motionFileOf(comp)) + '" alt=""/></div>'
        + '<p class="motion-role">' + roleName(comp.role) + '</p>'
        + '<div class="motion-actions">'
        + '<button class="btn tiny primary" data-act="insert">插入文首</button>'
        + '<button class="btn tiny ghost" data-act="copy">复制 SVG</button>'
        + '</div></div>';
    });
    h += '</div></div>'
      + '<div class="motion-foot"><span>已插入 ' + state.motion.length + ' 个（依点击顺序排在封面下方）</span>'
      + '<button class="btn tiny ghost" id="motionClear">清空动效</button></div>'
      + '</div>';
    modal.innerHTML = h;

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    modal.querySelector('#motionClose').addEventListener('click', closeModal);
    modal.querySelector('#motionClear').addEventListener('click', function () {
      state.motion = [];
      convert();
      renderMotionModal();
      toast('已清空动效组件');
    });
    modal.querySelectorAll('.motion-style').forEach(function (b) {
      b.addEventListener('click', function () {
        state.motionStyle = b.dataset.style;
        renderMotionModal();
      });
    });
    modal.querySelectorAll('.motion-card').forEach(function (card, idx) {
      var comp = componentsOf(state.motionStyle)[idx];
      card.querySelector('[data-act="insert"]').addEventListener('click', function () {
        insertMotion(comp);
      });
      card.querySelector('[data-act="copy"]').addEventListener('click', function () {
        copyMotion(comp);
      });
    });

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    var modal = document.getElementById('motionModal');
    if (modal) modal.parentNode.removeChild(modal);
    document.body.style.overflow = '';
  }

  /* ---------- 复制 / 下载 ---------- */

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
  motionBtn.addEventListener('click', openMotionModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
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
  buildPicker();
  editor.value = SAMPLE_MD;
  convert();
})();
