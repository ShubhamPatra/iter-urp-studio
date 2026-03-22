function le(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function normalizeImagePath(pathValue) {
  return (pathValue || '').toString().trim().replace(/\\/g, '/');
}

function normalizeWidth(width, fallback) {
  const value = (width || '').toString().trim();
  return value || fallback;
}

function toPtWidth(width, fallbackPt) {
  const raw = (width || '').toString().trim();
  if (!raw) return fallbackPt;

  const textWidthMatch = raw.match(/^([0-9]*\.?[0-9]+)\\textwidth$/);
  if (textWidthMatch) {
    return Math.round(Number(textWidthMatch[1]) * 640);
  }

  const ptMatch = raw.match(/^([0-9]*\.?[0-9]+)pt$/);
  if (ptMatch) {
    return Math.round(Number(ptMatch[1]));
  }

  const cmMatch = raw.match(/^([0-9]*\.?[0-9]+)cm$/);
  if (cmMatch) {
    return Math.round(Number(cmMatch[1]) * 28.3465);
  }

  return fallbackPt;
}

function parseStructuredLines(content) {
  const lines = (content || '').split('\n').filter((line) => line.trim().length > 0);
  const items = [];
  let currentTop = null;

  lines.forEach((rawLine) => {
    const indent = rawLine.match(/^\s*/)[0].length;
    const trimmed = rawLine.trim();
    const text = trimmed.replace(/^[-*]\s+/, '');
    if (!text) return;

    if (indent >= 2 && currentTop) {
      currentTop.children.push(text);
      return;
    }

    currentTop = { text, children: [] };
    items.push(currentTop);
  });

  return items;
}

function textPut(x, y, size, color, text, useBold) {
  const face = useBold ? '\\bfseries' : '';
  return `\\put(${x},${y}){\\fontsize{${size}}{1}\\selectfont\\color{${color}}${face} ${le(text)}}`;
}

function renderPageBackground() {
  return `\\begin{tikzpicture}[overlay]
\\path(0pt,0pt);
\\filldraw[color_283006][even odd rule]
(-15pt, 10pt) -- (944.981pt, 10pt)
 -- (944.981pt, 10pt)
 -- (944.981pt, -529.972pt)
 -- (944.981pt, -529.972pt)
 -- (-15pt, -529.972pt)
 -- (-15pt, -529.972pt)
 -- (-15pt, 10pt) -- cycle
;
\\filldraw[color_283006][even odd rule]
(-15pt, 10pt) -- (945.009pt, 10pt)
 -- (945.009pt, 10pt)
 -- (945.009pt, -530pt)
 -- (945.009pt, -530pt)
 -- (-15pt, -530pt)
 -- (-15pt, -530pt)
 -- (-15pt, 10pt) -- cycle
;
\\end{tikzpicture}`;
}

function renderTitleFrame(title) {
  const authors = (title.authors || []).filter((a) => a && (a.name || a.regNo));
  const authorLines = (authors.length ? authors : [{ name: 'Name1', regNo: 'Regd.no.' }, { name: 'Name2', regNo: 'Regd.no.' }])
    .slice(0, 4)
    .map((a, index) => textPut(387.009, -275.194 - (index * 24), 20.013, 'color_29791', `${a.name || 'Name'} (${a.regNo || 'Regd.no.'})`, false))
    .join('\n');

  const reviewType = title.reviewType || 'Interim Progress Review Presentation';
  const projectTitle = title.projectTitle || 'Title of project here';
  const supervisor = title.supervisorName || 'Prof./Dr./Mr./Ms. XYZ';
  const dept = title.supervisorDept || 'DoCS&IT';

  return `${renderPageBackground()}
\\begin{picture}(-5,0)(2.5,0)
${textPut(103.488, -86.094, 32.003, 'color_29791', 'Final year Research Project (URP 4301)', true)}
${textPut(121.006, -124.391, 32.003, 'color_29791', reviewType, true)}
${textPut(447.501, -150.809, 20.013, 'color_29791', 'on', true)}
${textPut(310.814, -182.813, 28.006, 'color_33455', projectTitle, true)}
${textPut(403.11, -251.213, 20.013, 'color_29791', 'Presented by', true)}
${authorLines}
${textPut(413.91, -381.408, 20.013, 'color_29791', 'Supervisor', true)}
${textPut(285.104, -404.794, 20.013, 'color_29791', `${supervisor}, ${dept}`, false)}
${textPut(154.2, -444.592, 18, 'color_29791', 'Department of Computer Science & Information Technology', true)}
${textPut(234.789, -466.192, 18, 'color_29791', 'Faculty of Engineering & Technology (ITER),', true)}
${textPut(133.989, -492.101, 18, 'color_29791', "Siksha 'O' Anusandhan Deemed to be University, Bhubaneswar, Odisha", false)}
\\put(50.027,-387.814){\\includegraphics[width=153.581pt,height=153.581pt]{logo_soa.png}}
${textPut(755.003, -329.902, 47.991, 'color_214303', 'ITER', true)}
\\end{picture}
\\begin{tikzpicture}[overlay]
\\path(0pt,0pt);
\\filldraw[color_216370][even odd rule]
(45.86pt, -121.244pt) -- (45.86pt, -121.244pt)
 -- (45.86pt, -121.244pt) .. controls (45.86pt, -103.386pt) and (50.565pt, -85.86801pt) .. (59.494pt, -70.41901pt)
 -- (59.494pt, -70.41901pt) .. controls (68.395pt, -54.94199pt) and (81.236pt, -42.10101pt) .. (96.685pt, -33.20001pt)
 -- (96.685pt, -33.20001pt) .. controls (112.162pt, -24.271pt) and (129.68pt, -19.565pt) .. (147.539pt, -19.565pt)
 -- (147.539pt, -19.565pt)
 -- (782.471pt, -19.565pt)
 -- (782.471pt, -19.565pt)
 -- (782.471pt, -19.565pt)
 -- (782.471pt, -19.565pt) .. controls (800.329pt, -19.565pt) and (817.847pt, -24.271pt) .. (833.296pt, -33.20001pt)
 -- (833.296pt, -33.20001pt) .. controls (848.773pt, -42.10101pt) and (861.614pt, -54.94199pt) .. (870.515pt, -70.39099pt)
 -- (870.515pt, -70.39099pt) .. controls (879.444pt, -85.86801pt) and (884.15pt, -103.386pt) .. (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt) .. controls (884.15pt, -139.102pt) and (879.444pt, -156.62pt) .. (870.515pt, -172.098pt)
 -- (870.515pt, -172.098pt) .. controls (861.614pt, -187.546pt) and (848.773pt, -200.387pt) .. (833.324pt, -209.288pt)
 -- (833.324pt, -209.288pt) .. controls (817.847pt, -218.217pt) and (800.329pt, -222.923pt) .. (782.471pt, -222.923pt)
 -- (782.471pt, -222.923pt)
 -- (147.539pt, -222.923pt)
 -- (147.539pt, -222.923pt)
 -- (147.539pt, -222.923pt)
 -- (147.539pt, -222.923pt) .. controls (129.68pt, -222.923pt) and (112.162pt, -218.217pt) .. (96.713pt, -209.288pt)
 -- (96.713pt, -209.288pt) .. controls (81.236pt, -200.387pt) and (68.395pt, -187.546pt) .. (59.494pt, -172.098pt)
 -- (59.494pt, -172.098pt) .. controls (50.565pt, -156.62pt) and (45.86pt, -139.102pt) .. (45.86pt, -121.244pt)
 -- (45.86pt, -121.244pt)
 -- (45.86pt, -121.244pt) -- cycle
;
\\draw[color_79596,line width=0.99211pt,miter limit=3.8637033]
(45.86pt, -121.244pt) -- (45.86pt, -121.244pt)
 -- (45.86pt, -121.244pt) .. controls (45.86pt, -103.386pt) and (50.565pt, -85.86801pt) .. (59.494pt, -70.41901pt)
 -- (59.494pt, -70.41901pt) .. controls (68.395pt, -54.94199pt) and (81.236pt, -42.10101pt) .. (96.685pt, -33.20001pt)
 -- (96.685pt, -33.20001pt) .. controls (112.162pt, -24.271pt) and (129.68pt, -19.565pt) .. (147.539pt, -19.565pt)
 -- (147.539pt, -19.565pt)
 -- (782.471pt, -19.565pt)
 -- (782.471pt, -19.565pt)
 -- (782.471pt, -19.565pt)
 -- (782.471pt, -19.565pt) .. controls (800.329pt, -19.565pt) and (817.847pt, -24.271pt) .. (833.296pt, -33.20001pt)
 -- (833.296pt, -33.20001pt) .. controls (848.773pt, -42.10101pt) and (861.614pt, -54.94199pt) .. (870.515pt, -70.39099pt)
 -- (870.515pt, -70.39099pt) .. controls (879.444pt, -85.86801pt) and (884.15pt, -103.386pt) .. (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt)
 -- (884.15pt, -121.244pt) .. controls (884.15pt, -139.102pt) and (879.444pt, -156.62pt) .. (870.515pt, -172.098pt)
 -- (870.515pt, -172.098pt) .. controls (861.614pt, -187.546pt) and (848.773pt, -200.387pt) .. (833.324pt, -209.288pt)
 -- (833.324pt, -209.288pt) .. controls (817.847pt, -218.217pt) and (800.329pt, -222.923pt) .. (782.471pt, -222.923pt)
 -- (782.471pt, -222.923pt)
 -- (147.539pt, -222.923pt)
 -- (147.539pt, -222.923pt)
 -- (147.539pt, -222.923pt)
 -- (147.539pt, -222.923pt) .. controls (129.68pt, -222.923pt) and (112.162pt, -218.217pt) .. (96.713pt, -209.288pt)
 -- (96.713pt, -209.288pt) .. controls (81.236pt, -200.387pt) and (68.395pt, -187.546pt) .. (59.494pt, -172.098pt)
 -- (59.494pt, -172.098pt) .. controls (50.565pt, -156.62pt) and (45.86pt, -139.102pt) .. (45.86pt, -121.244pt) -- cycle
;
\\end{tikzpicture}
\\begin{tikzpicture}[overlay]
\\path(0pt,0pt);
\\filldraw[color_216370][even odd rule]
(38.178pt, -440.17pt) -- (38.178pt, -440.17pt)
 -- (38.178pt, -440.17pt) .. controls (38.178pt, -437.392pt) and (38.915pt, -434.643pt) .. (40.304pt, -432.233pt)
 -- (40.304pt, -432.233pt) .. controls (41.693pt, -429.795pt) and (43.706pt, -427.811pt) .. (46.115pt, -426.394pt)
 -- (46.115pt, -426.394pt) .. controls (48.553pt, -425.005pt) and (51.274pt, -424.268pt) .. (54.08pt, -424.268pt)
 -- (54.08pt, -424.268pt)
 -- (860.594pt, -424.296pt)
 -- (860.594pt, -424.296pt)
 -- (860.594pt, -424.296pt)
 -- (860.594pt, -424.296pt) .. controls (863.372pt, -424.296pt) and (866.121pt, -425.033pt) .. (868.531pt, -426.422pt)
 -- (868.531pt, -426.422pt) .. controls (870.969pt, -427.811pt) and (872.953pt, -429.824pt) .. (874.37pt, -432.233pt)
 -- (874.37pt, -432.233pt) .. controls (875.759pt, -434.671pt) and (876.496pt, -437.392pt) .. (876.496pt, -440.198pt)
 -- (876.496pt, -440.198pt)
 -- (876.496pt, -503.751pt)
 -- (876.496pt, -503.751pt)
 -- (876.496pt, -503.751pt)
 -- (876.496pt, -503.751pt) .. controls (876.496pt, -506.529pt) and (875.759pt, -509.279pt) .. (874.37pt, -511.688pt)
 -- (874.37pt, -511.688pt) .. controls (872.981pt, -514.126pt) and (870.969pt, -516.11pt) .. (868.559pt, -517.528pt)
 -- (868.559pt, -517.528pt) .. controls (866.121pt, -518.917pt) and (863.4pt, -519.654pt) .. (860.594pt, -519.654pt)
 -- (860.594pt, -519.654pt)
 -- (54.052pt, -519.654pt)
 -- (54.052pt, -519.654pt)
 -- (54.052pt, -519.654pt)
 -- (54.052pt, -519.654pt) .. controls (51.274pt, -519.654pt) and (48.524pt, -518.917pt) .. (46.115pt, -517.528pt)
 -- (46.115pt, -517.528pt) .. controls (43.677pt, -516.139pt) and (41.693pt, -514.126pt) .. (40.276pt, -511.717pt)
 -- (40.276pt, -511.717pt) .. controls (38.887pt, -509.279pt) and (38.15pt, -506.557pt) .. (38.15pt, -503.751pt)
 -- (38.178pt, -440.17pt) -- cycle
;
\\draw[color_79596,line width=0.99211pt,miter limit=3.8637033]
(38.178pt, -440.17pt) -- (38.178pt, -440.17pt)
 -- (38.178pt, -440.17pt) .. controls (38.178pt, -437.392pt) and (38.915pt, -434.643pt) .. (40.304pt, -432.233pt)
 -- (40.304pt, -432.233pt) .. controls (41.693pt, -429.795pt) and (43.706pt, -427.811pt) .. (46.115pt, -426.394pt)
 -- (46.115pt, -426.394pt) .. controls (48.553pt, -425.005pt) and (51.274pt, -424.268pt) .. (54.08pt, -424.268pt)
 -- (54.08pt, -424.268pt)
 -- (860.594pt, -424.296pt)
 -- (860.594pt, -424.296pt)
 -- (860.594pt, -424.296pt)
 -- (860.594pt, -424.296pt) .. controls (863.372pt, -424.296pt) and (866.121pt, -425.033pt) .. (868.531pt, -426.422pt)
 -- (868.531pt, -426.422pt) .. controls (870.969pt, -427.811pt) and (872.953pt, -429.824pt) .. (874.37pt, -432.233pt)
 -- (874.37pt, -432.233pt) .. controls (875.759pt, -434.671pt) and (876.496pt, -437.392pt) .. (876.496pt, -440.198pt)
 -- (876.496pt, -440.198pt)
 -- (876.496pt, -503.751pt)
 -- (876.496pt, -503.751pt)
 -- (876.496pt, -503.751pt)
 -- (876.496pt, -503.751pt) .. controls (876.496pt, -506.529pt) and (875.759pt, -509.279pt) .. (874.37pt, -511.688pt)
 -- (874.37pt, -511.688pt) .. controls (872.981pt, -514.126pt) and (870.969pt, -516.11pt) .. (868.559pt, -517.528pt)
 -- (868.559pt, -517.528pt) .. controls (866.121pt, -518.917pt) and (863.4pt, -519.654pt) .. (860.594pt, -519.654pt)
 -- (860.594pt, -519.654pt)
 -- (54.052pt, -519.654pt)
 -- (54.052pt, -519.654pt)
 -- (54.052pt, -519.654pt)
 -- (54.052pt, -519.654pt) .. controls (51.274pt, -519.654pt) and (48.524pt, -518.917pt) .. (46.115pt, -517.528pt)
 -- (46.115pt, -517.528pt) .. controls (43.677pt, -516.139pt) and (41.693pt, -514.126pt) .. (40.276pt, -511.717pt)
 -- (40.276pt, -511.717pt) .. controls (38.887pt, -509.279pt) and (38.15pt, -506.557pt) .. (38.15pt, -503.751pt)
 -- (38.178pt, -440.17pt) -- cycle
;
\\end{tikzpicture}
\\begin{picture}(-5,0)(2.5,0)
\\put(465,-86.094){\\makebox(0,0)[c]{\\fontsize{32.003}{1}\\selectfont\\color{color_29791}\\bfseries Final year Research Project (URP 4301)}}
\\put(465,-124.391){\\makebox(0,0)[c]{\\fontsize{32.003}{1}\\selectfont\\color{color_29791}\\bfseries ${le(reviewType)}}}
\\put(465,-150.809){\\makebox(0,0)[c]{\\fontsize{20.013}{1}\\selectfont\\color{color_29791}\\bfseries on}}
\\put(465,-182.813){\\makebox(0,0)[c]{\\fontsize{28.006}{1}\\selectfont\\color{color_33455}\\bfseries ${le(projectTitle)}}}
\\put(449,-444.592){\\makebox(0,0)[c]{\\fontsize{18}{1}\\selectfont\\color{color_29791}\\bfseries Department of Computer Science \\& Information Technology}}
\\put(449,-466.192){\\makebox(0,0)[c]{\\fontsize{18}{1}\\selectfont\\color{color_29791}\\bfseries Faculty of Engineering \\& Technology (ITER),}}
\\put(449,-492.101){\\makebox(0,0)[c]{\\fontsize{18}{1}\\selectfont\\color{color_29791} ${le("Siksha 'O' Anusandhan Deemed to be University, Bhubaneswar, Odisha")}}}
\\end{picture}`;
}

function renderContentTitleBar(titleText) {
  return `\\begin{tikzpicture}[overlay]
\\path(0pt,0pt);
\\filldraw[color_216370][even odd rule]
(20.49pt, -20.586pt) -- (20.49pt, -20.586pt)
 -- (20.49pt, -20.586pt) .. controls (20.49pt, -18.91299pt) and (20.915pt, -17.29797pt) .. (21.765pt, -15.85199pt)
 -- (21.765pt, -15.85199pt) .. controls (22.587pt, -14.435pt) and (23.778pt, -13.24402pt) .. (25.224pt, -12.39398pt)
 -- (25.224pt, -12.39398pt) .. controls (26.641pt, -11.57202pt) and (28.285pt, -11.146pt) .. (29.929pt, -11.146pt)
 -- (29.929pt, -11.146pt)
 -- (918.109pt, -11.146pt)
 -- (918.109pt, -11.146pt)
 -- (918.109pt, -11.146pt)
 -- (918.109pt, -11.146pt) .. controls (919.781pt, -11.146pt) and (921.397pt, -11.57202pt) .. (922.843pt, -12.422pt)
 -- (922.843pt, -12.422pt) .. controls (924.26pt, -13.24402pt) and (925.45pt, -14.435pt) .. (926.301pt, -15.88pt)
 -- (926.301pt, -15.88pt) .. controls (927.123pt, -17.29797pt) and (927.548pt, -18.94199pt) .. (927.548pt, -20.586pt)
 -- (927.576pt, -58.37201pt)
 -- (927.576pt, -58.37201pt)
 -- (927.576pt, -58.37201pt)
 -- (927.576pt, -58.37201pt) .. controls (927.576pt, -60.04401pt) and (927.151pt, -61.66pt) .. (926.301pt, -63.10599pt)
 -- (926.301pt, -63.10599pt) .. controls (925.479pt, -64.52301pt) and (924.288pt, -65.71301pt) .. (922.843pt, -66.564pt)
 -- (922.843pt, -66.564pt) .. controls (921.425pt, -67.38599pt) and (919.781pt, -67.811pt) .. (918.137pt, -67.811pt)
 -- (918.137pt, -67.811pt)
 -- (29.929pt, -67.83899pt)
 -- (29.929pt, -67.83899pt)
 -- (29.929pt, -67.83899pt)
 -- (29.929pt, -67.83899pt) .. controls (28.257pt, -67.83899pt) and (26.641pt, -67.414pt) .. (25.195pt, -66.564pt)
 -- (25.195pt, -66.564pt) .. controls (23.778pt, -65.742pt) and (22.587pt, -64.55099pt) .. (21.737pt, -63.10599pt)
 -- (21.737pt, -63.10599pt) .. controls (20.915pt, -61.68799pt) and (20.49pt, -60.04401pt) .. (20.49pt, -58.39999pt)
 -- (20.49pt, -20.586pt) -- cycle
;
\\draw[color_79596,line width=0.99211pt,miter limit=3.8637033]
(20.49pt, -20.586pt) -- (20.49pt, -20.586pt)
 -- (20.49pt, -20.586pt) .. controls (20.49pt, -18.91299pt) and (20.915pt, -17.29797pt) .. (21.765pt, -15.85199pt)
 -- (21.765pt, -15.85199pt) .. controls (22.587pt, -14.435pt) and (23.778pt, -13.24402pt) .. (25.224pt, -12.39398pt)
 -- (25.224pt, -12.39398pt) .. controls (26.641pt, -11.57202pt) and (28.285pt, -11.146pt) .. (29.929pt, -11.146pt)
 -- (29.929pt, -11.146pt)
 -- (918.109pt, -11.146pt)
 -- (918.109pt, -11.146pt)
 -- (918.109pt, -11.146pt)
 -- (918.109pt, -11.146pt) .. controls (919.781pt, -11.146pt) and (921.397pt, -11.57202pt) .. (922.843pt, -12.422pt)
 -- (922.843pt, -12.422pt) .. controls (924.26pt, -13.24402pt) and (925.45pt, -14.435pt) .. (926.301pt, -15.88pt)
 -- (926.301pt, -15.88pt) .. controls (927.123pt, -17.29797pt) and (927.548pt, -18.94199pt) .. (927.548pt, -20.586pt)
 -- (927.576pt, -58.37201pt)
 -- (927.576pt, -58.37201pt)
 -- (927.576pt, -58.37201pt)
 -- (927.576pt, -58.37201pt) .. controls (927.576pt, -60.04401pt) and (927.151pt, -61.66pt) .. (926.301pt, -63.10599pt)
 -- (926.301pt, -63.10599pt) .. controls (925.479pt, -64.52301pt) and (924.288pt, -65.71301pt) .. (922.843pt, -66.564pt)
 -- (922.843pt, -66.564pt) .. controls (921.425pt, -67.38599pt) and (919.781pt, -67.811pt) .. (918.137pt, -67.811pt)
 -- (918.137pt, -67.811pt)
 -- (29.929pt, -67.83899pt)
 -- (29.929pt, -67.83899pt)
 -- (29.929pt, -67.83899pt)
 -- (29.929pt, -67.83899pt) .. controls (28.257pt, -67.83899pt) and (26.641pt, -67.414pt) .. (25.195pt, -66.564pt)
 -- (25.195pt, -66.564pt) .. controls (23.778pt, -65.742pt) and (22.587pt, -64.55099pt) .. (21.737pt, -63.10599pt)
 -- (21.737pt, -63.10599pt) .. controls (20.915pt, -61.68799pt) and (20.49pt, -60.04401pt) .. (20.49pt, -58.39999pt)
 -- (20.49pt, -20.586pt) -- cycle
;
\\end{tikzpicture}
\\begin{picture}(-5,0)(2.5,0)
\\put(31.602,-62.99201){\\includegraphics[width=42.491pt,height=42.491pt]{logo_soa.png}}
${textPut(147.113, -50.69, 28.006, 'color_77805', titleText, true)}
\\end{picture}`;
}

function renderSlideBody(slide) {
  const structure = parseStructuredLines(slide.content);
  const top = structure.length ? structure : [{ text: 'Content here', children: [] }];
  const lines = [];
  let y = -119;
  const maxTop = 7;

  top.slice(0, maxTop).forEach((entry) => {
    lines.push(textPut(56.008, y, 13.691, 'color_88269', '▪', false));
    lines.push(textPut(80.698, y - 2, 17.603, 'color_29791', entry.text, true));
    y -= 30;
    entry.children.slice(0, 3).forEach((child) => {
      lines.push(textPut(83.901, y, 15.506, 'color_88269', '▪', false));
      lines.push(textPut(104.707, y - 1, 15.506, 'color_29791', child, false));
      y -= 29;
    });
  });

  const images = (slide.images || [])
    .filter((img) => img && img.path)
    .slice(0, 2)
    .map((img, index) => {
      const widthPt = toPtWidth(img.width, 230);
      const aspectRatio = Number(img.aspectRatio) > 0 ? Number(img.aspectRatio) : 0.65;
      const heightPt = Math.round(widthPt * aspectRatio);
      const fallbackX = img.position === 'left' ? 60 : img.position === 'center' ? 340 : 560;
      const xPos = Number.isFinite(Number(img.x)) ? Math.round(Number(img.x)) : fallbackX;
      const yRaw = Number.isFinite(Number(img.y)) ? Math.round(Number(img.y)) : (index === 0 ? 250 : 420);
      const yPos = -Math.max(0, yRaw + heightPt);
      return `\\put(${xPos},${yPos}){\\includegraphics[width=${widthPt}pt]{${normalizeImagePath(img.path)}}}`;
    })
    .join('\n');

  return `${lines.join('\n')}${images ? `\n${images}` : ''}`;
}

function renderContentFrame(slide, pageNo) {
  return `${renderPageBackground()}
\\begin{picture}(-5,0)(2.5,0)
${textPut(417.113, -509.704, 11.991, 'color_164839', 'Dept. of CS & IT', false)}
${textPut(864.109, -509.704, 11.991, 'color_164839', String(pageNo), false)}
\\end{picture}
${renderContentTitleBar(slide.title || 'Slide Title')}
\\begin{picture}(-5,0)(2.5,0)
${renderSlideBody(slide)}
\\end{picture}`;
}

function renderThankYouFrame(pageNo) {
  return `${renderPageBackground()}
\\begin{picture}(-5,0)(2.5,0)
${textPut(417.113, -509.704, 11.991, 'color_164839', 'Dept. of CS & IT', false)}
${textPut(856.398, -509.704, 11.991, 'color_164839', String(pageNo), false)}
${textPut(150, -300, 112, 'color_273592', 'Thank You!', true)}
\\end{picture}`;
}

function generatePPTLatex(pptData) {
  const { title = {}, slides = [] } = pptData || {};
  const content = (slides || []).map((slide, index) => renderContentFrame(slide, index + 2)).join('\n\\newpage\n');
  const endPageNo = slides.length + 2;

  return `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{color,pxfonts,fix-cm}
\\usepackage{latexsym}
\\usepackage[T1]{fontenc}
\\usepackage{pict2e}
\\usepackage{wasysym}
\\usepackage[english]{babel}
\\usepackage{tikz}
\\usepackage{graphicx}
\\pagestyle{empty}
\\usepackage[margin=0in,paperwidth=960pt,paperheight=540pt]{geometry}
\\begin{document}
\\definecolor{color_283006}{rgb}{1,1,1}
\\definecolor{color_29791}{rgb}{0,0,0}
\\definecolor{color_216370}{rgb}{0.733333,0.839216,0.933333}
\\definecolor{color_79596}{rgb}{0.192157,0.32549,0.560784}
\\definecolor{color_33455}{rgb}{0,0.439216,0.752941}
\\definecolor{color_214303}{rgb}{0.752941,0,0}
\\definecolor{color_164839}{rgb}{0.533333,0.533333,0.533333}
\\definecolor{color_88269}{rgb}{0.219608,0.568628,0.654902}
\\definecolor{color_77805}{rgb}{0.180392,0.458824,0.709804}
\\definecolor{color_98869}{rgb}{0.266667,0.447059,0.768628}
\\definecolor{color_273592}{rgb}{0.968628,0.792157,0.67451}
${renderTitleFrame(title)}
\\newpage
${content}
\\newpage
${renderThankYouFrame(endPageNo)}
\\end{document}`;
}

function reportAlignment(position) {
  if (position === 'left') return '\\raggedright';
  if (position === 'right') return '\\raggedleft';
  return '\\centering';
}

function sanitizeBibKey(rawKey, fallbackIndex) {
  const normalized = String(rawKey || '').trim().replace(/[^a-zA-Z0-9:_-]/g, '');
  return normalized || `ref${fallbackIndex}`;
}

function normalizeSections(chapter) {
  if (Array.isArray(chapter.sections) && chapter.sections.length > 0) {
    return chapter.sections;
  }

  if (Array.isArray(chapter.subsections) && chapter.subsections.length > 0) {
    return chapter.subsections.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      images: item.images,
      subsections: [],
    }));
  }

  return [];
}

function renderFigureBlocks(images) {
  return (images || [])
    .filter((img) => img && img.path)
    .map((img) => {
      const width = normalizeWidth(img.width, '0.5\\textwidth');
      const imagePath = normalizeImagePath(img.path);
      const caption = le(img.caption || '');
      const align = reportAlignment(img.position || 'center');
      return `\\begin{figure}[h]
${align}
\\includegraphics[width=${width}]{${imagePath}}
${caption ? `\\caption{${caption}}` : ''}
\\end{figure}`;
    })
    .join('\n\n');
}

function renderReferences(references) {
  const seenKeys = new Set();
  const items = [];

  (references || []).forEach((ref, index) => {
    if (!ref) return;

    if (typeof ref === 'string') {
      const text = ref.trim();
      if (!text) return;
      const key = sanitizeBibKey(`ref${index + 1}`, index + 1);
      if (seenKeys.has(key)) return;
      seenKeys.add(key);
      items.push({ key, text });
      return;
    }

    const text = String(ref.text || '').trim();
    if (!text) return;
    const key = sanitizeBibKey(ref.key, index + 1);
    if (seenKeys.has(key)) return;
    seenKeys.add(key);
    items.push({ key, text });
  });

  if (!items.length) {
    return '';
  }

  const refsBlock = items.map((ref) => `\\bibitem{${ref.key}}
${ref.text}`).join('\n\n');

  return `%---------------------- Bibliography ----------------------%
\\cleardoublepage
\\phantomsection
\\addcontentsline{toc}{chapter}{References}
\\renewcommand\\bibname{References}
\\bibliographystyle{IEEEtran}

\\begin{thebibliography}{99}
${refsBlock}
\\end{thebibliography}`;
}

function generateReportLatex(reportData) {
  const { front = {}, chapters = [], references = [], annexure = '' } = reportData || {};

  const reportTitle = le(front.projectTitle || 'Project Title Here');
  const reportDept = le(front.department || 'Computer Science & Information Technology');
  const reportYear = le(front.year || '2026');
  const reportSupervisor = le(front.supervisor || 'Prof./Dr./Mr./Ms. xxxx xxxx');

  const authorLines = (front.authors || [])
    .filter((a) => a && (a.name || a.regNo))
    .map((a) => `    \\textbf{${le(a.name || 'Name')} - ${le(a.regNo || 'Registration Number')}} \\\\`)
    .join('\n') || [
      '    \\textbf{{ Name } { - Registration Number}} \\\\',
      '    \\textbf{{ Name } { - Registration Number}} \\\\',
      '    \\textbf{{ Name } { - Registration Number}}'
    ].join('\n');

  const frontPage = `\\begin{titlepage}
    \\centering

    \\Large \\textbf {${reportTitle}}\\\\[0.4in]

    \\large{ \\textbf{Project Report} \\\\[0.1in]  {submitted in partial fulfillment of the} \\\\[0.1in] {requirements for the award of}\\\\[0.2in] \\textsc{BACHELOR OF TECHNOLOGY \\\\IN\\\\ ${reportDept}} \\\\[0.2in]
    }

    \\normalsize Submitted by \\\\[0.2in]

${authorLines}

    \\vspace{.2in}
    Under the guidance of\\\\[0.2in]
    \\textbf{\\large{${reportSupervisor}}}\\\\[0.3in]

    \\vspace{1.5in}
    \\includegraphics[width=0.2\\textwidth]{images/logo.png}\\\\[0.3in]

    \\textbf {Department of ${reportDept}}\\\\
    \\textbf{Institute of Technical Education \\& Research,}\\\\
    \\textbf{Siksha \`O' Anusandhan}\\\\
    \\textbf {Bhubaneswar, India-751030}\\\\[0.2in]
    \\textbf {${reportYear}}\\\\[0.2in]

\\end{titlepage}`;

  const chaptersBlock = (chapters || []).map((ch) => {
    const chapterTitle = le(ch.title || 'Chapter Title');
    const sections = normalizeSections(ch);

    const sectionBlocks = sections.map((section) => {
      const sectionTitle = le(section.title || 'Section Title');
      const sectionContent = String(section.content || '').trim();
      const sectionImageBlocks = renderFigureBlocks(section.images);

      const subsectionBlocks = (section.subsections || []).map((sub) => {
        const subsectionTitle = le(sub.title || 'Subsection Title');
        const subsectionContent = String(sub.content || '').trim();
        const subsectionImageBlocks = renderFigureBlocks(sub.images);
        return `\\subsection{${subsectionTitle}}
${subsectionContent}
${subsectionImageBlocks}`.trim();
      }).join('\n\n');

      return `\\section{${sectionTitle}}
${sectionContent}
${sectionImageBlocks}
${subsectionBlocks}`.trim();
    }).join('\n\n');

    return `\\chapter{${chapterTitle}}
\\noindent\\rule{\\linewidth}{2pt}

${sectionBlocks}`;
  }).join('\n\n');

  const bibliographyBlock = renderReferences(references);
  const annexureText = String(annexure || '').trim();
  const annexureBlock = annexureText ? `\\newpage
\\thispagestyle{empty}
\\cleardoublepage
\\phantomsection
\\addcontentsline{toc}{chapter}{Annexure}

${annexureText}` : '';

  return `\\documentclass[12pt,a4paper]{report}
\\input{file-setup}

\\begin{document}

%---------------------- Front Matter ----------------------%
${frontPage}

%---------------------- Table of Contents ----------------------%
\\renewcommand{\\contentsname}{Table of Contents}
\\tableofcontents
\\clearpage

%---------------------- List of Figures ----------------------%
\\listoffigures
\\clearpage

%---------------------- List of Tables ----------------------%
\\listoftables
\\clearpage

%---------------------- Main Content ----------------------%
${chaptersBlock}

${bibliographyBlock}

%---------------------- Annexure ----------------------%
${annexureBlock}

\\end{document}`;
}

module.exports = {
  generatePPTLatex,
  generateReportLatex,
};
