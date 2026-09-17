import express from "express";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use('/images/schedule', express.static(path.join(process.cwd(), 'public/images/schedule')));
app.use('/images/projects', express.static(path.join(process.cwd(), 'public/images/projects')));
app.use('/images/classes', express.static(path.join(process.cwd(), 'public/images/classes')));
app.use('/images/alumni', express.static(path.join(process.cwd(), 'public/images/alumni')));
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
app.use('/alumni', express.static(path.join(process.cwd(), 'public/alumni')));
app.use('/alumni', express.static(path.join(process.cwd(), 'dist/alumni')));
app.use('/classposter', express.static(path.join(process.cwd(), 'public/classposter')));
app.use('/classposter', express.static(path.join(process.cwd(), 'dist/classposter')));
app.use('/SGfes', express.static(path.join(process.cwd(), 'public/SGfes')));
app.use('/SGfes', express.static(path.join(process.cwd(), 'SGfes')));

const searchDirs = [
  path.join(process.cwd(), 'public/classposter'),
  path.join(process.cwd(), 'dist/classposter'),
  path.join(process.cwd(), 'public/alumni'),
  path.join(process.cwd(), 'dist/alumni'),
  path.join(process.cwd(), 'public/images/schedule'),
  path.join(process.cwd(), 'public/images/projects'),
  path.join(process.cwd(), 'public/images/classes'),
  path.join(process.cwd(), 'public/images/alumni'),
  path.join(process.cwd(), 'public/images'),
  path.join(process.cwd(), 'public/SGfes'),
  path.join(process.cwd(), 'SGfes'),
  path.join(process.cwd(), 'public'),
  path.join(process.cwd(), 'dist')
];

const normalizeClassCode = (input: string): string => {
  if (!input) return '';
  const half = input
    .replace(/[！-～]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/ー|—|–/g, '-')
    .trim();

  const match = half.match(/([1-3])\s*(?:年)?\s*[-_/\s]?\s*([A-Za-z])(?:\s*組)?/i);
  if (match) {
    return `${match[1]}-${match[2].toUpperCase()}`;
  }

  const idMatch = half.match(/p-([1-3])([a-z])/i);
  if (idMatch) {
    return `${idMatch[1]}-${idMatch[2].toUpperCase()}`;
  }

  return '';
};

const convertPdfToPng = (pdfPath: string, pngPath: string): boolean => {
  try {
    if (!fs.existsSync(pdfPath)) return false;
    const dir = path.dirname(pngPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    execSync(
      `gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r150 -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -dFirstPage=1 -dLastPage=1 -sOutputFile="${pngPath}" "${pdfPath}"`,
      { stdio: 'ignore', timeout: 15000 }
    );
    return fs.existsSync(pngPath) && fs.statSync(pngPath).size > 100;
  } catch {
    return false;
  }
};

app.all(['/classposter/:file', '/alumni/:file', '/images/schedule/:file', '/images/projects/:file', '/images/classes/:file', '/images/alumni/:file', '/images/:file', '/SGfes/:file', '/:file.pdf'], (req, res, next) => {
  const rawFile = req.params.file || req.path.split('/').pop() || '';
  let decoded = rawFile;
  try {
    decoded = decodeURIComponent(rawFile);
  } catch {}

  const cleanBase = path.basename(decoded);
  const ext = path.extname(cleanBase).toLowerCase();
  let stem = path.basename(cleanBase, ext);

  const normalizedCode = normalizeClassCode(stem) || normalizeClassCode(cleanBase);
  if (normalizedCode) {
    stem = normalizedCode;
  }

  const candidateDirs = [
    path.join(process.cwd(), 'public/classposter'),
    path.join(process.cwd(), 'dist/classposter'),
    path.join(process.cwd(), 'public/alumni'),
    path.join(process.cwd(), 'dist/alumni'),
    path.join(process.cwd(), 'public/images/schedule'),
    path.join(process.cwd(), 'public/images/projects'),
    path.join(process.cwd(), 'public/images/classes'),
    path.join(process.cwd(), 'public/images/alumni'),
    path.join(process.cwd(), 'public/images'),
    path.join(process.cwd(), 'public/SGfes'),
    path.join(process.cwd(), 'SGfes'),
    path.join(process.cwd(), 'public'),
    path.join(process.cwd(), 'dist')
  ];

  if (req.path.startsWith('/classposter/')) {
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
      for (const dir of candidateDirs) {
        if (!fs.existsSync(dir)) continue;
        const imgPath = path.join(dir, `${stem}${ext}`);
        if (fs.existsSync(imgPath) && fs.statSync(imgPath).size > 100) {
          const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
          res.setHeader('Content-Type', contentType);
          return res.sendFile(imgPath);
        }
        for (const altExt of ['.png', '.jpg', '.jpeg', '.webp']) {
          const altImgPath = path.join(dir, `${stem}${altExt}`);
          if (fs.existsSync(altImgPath) && fs.statSync(altImgPath).size > 100) {
            const contentType = altExt === '.png' ? 'image/png' : altExt === '.webp' ? 'image/webp' : 'image/jpeg';
            res.setHeader('Content-Type', contentType);
            return res.sendFile(altImgPath);
          }
        }
      }

      for (const dir of candidateDirs) {
        if (!fs.existsSync(dir)) continue;
        const pdfPath = path.join(dir, `${stem}.pdf`);
        if (fs.existsSync(pdfPath) && fs.statSync(pdfPath).size > 100) {
          const publicDir = path.join(process.cwd(), 'public/classposter');
          if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
          const targetPng = path.join(publicDir, `${stem}.png`);
          const ok = convertPdfToPng(pdfPath, targetPng);
          if (ok && fs.existsSync(targetPng)) {
            res.setHeader('Content-Type', 'image/png');
            return res.sendFile(targetPng);
          }
        }
      }
    } else if (ext === '.pdf' || !ext) {
      for (const dir of candidateDirs) {
        if (!fs.existsSync(dir)) continue;
        const pdfTarget = ext === '.pdf' ? path.join(dir, cleanBase) : path.join(dir, `${stem}.pdf`);
        if (fs.existsSync(pdfTarget) && fs.statSync(pdfTarget).size > 100) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline');
          return res.sendFile(pdfTarget);
        }
      }
    }
  }

  const variants = [
    rawFile,
    decoded,
    decoded.normalize('NFC'),
    decoded.normalize('NFD'),
    rawFile.normalize('NFC'),
    rawFile.normalize('NFD')
  ];

  if (stem) {
    for (const altExt of ['.png', '.jpg', '.jpeg', '.webp', '.pdf']) {
      variants.push(`${stem}${altExt}`);
      variants.push(`${stem}${altExt}`.normalize('NFC'));
      variants.push(`${stem}${altExt}`.normalize('NFD'));
    }
  }

  if (normalizedCode) {
    for (const altExt of ['.png', '.jpg', '.jpeg', '.webp', '.pdf']) {
      variants.push(`${normalizedCode}${altExt}`);
    }
  }

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const v of variants) {
      const target = path.join(dir, v);
      if (fs.existsSync(target) && fs.statSync(target).isFile()) {
        const stats = fs.statSync(target);
        if (target.endsWith('.pdf')) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline');
        } else if (target.endsWith('.png')) {
          res.setHeader('Content-Type', 'image/png');
        } else if (target.endsWith('.jpg') || target.endsWith('.jpeg')) {
          res.setHeader('Content-Type', 'image/jpeg');
        } else if (target.endsWith('.webp')) {
          res.setHeader('Content-Type', 'image/webp');
        }
        res.setHeader('Content-Length', stats.size.toString());
        if (req.method === 'HEAD') {
          return res.status(200).end();
        }
        return res.sendFile(target);
      }
    }
  }

  if (req.path.startsWith('/classposter/') || req.path.endsWith('.pdf')) {
    return res.status(404).send('Not Found');
  }

  next();
});

app.get("/api/check-poster", (req, res) => {
  const file = String(req.query.file || '');
  if (!file) return res.json({ exists: false, size: 0 });
  const safeName = path.basename(file);
  const ext = path.extname(safeName).toLowerCase();
  let stem = path.basename(safeName, ext);

  const normalizedCode = normalizeClassCode(stem) || normalizeClassCode(safeName);
  if (normalizedCode) {
    stem = normalizedCode;
  }

  const candidateDirs = [
    path.join(process.cwd(), 'public/classposter'),
    path.join(process.cwd(), 'dist/classposter'),
    path.join(process.cwd(), 'public/images/classes'),
    path.join(process.cwd(), 'dist/images/classes')
  ];

  for (const dir of candidateDirs) {
    if (!fs.existsSync(dir)) continue;

    const pngPath = path.join(dir, `${stem}.png`);
    const jpgPath = path.join(dir, `${stem}.jpg`);
    const jpegPath = path.join(dir, `${stem}.jpeg`);
    const webpPath = path.join(dir, `${stem}.webp`);
    const pdfPath = path.join(dir, `${stem}.pdf`);

    if (fs.existsSync(pngPath) && fs.statSync(pngPath).size > 100) {
      return res.json({
        exists: true,
        size: fs.statSync(pngPath).size,
        imageUrl: `/classposter/${stem}.png`,
        pdfUrl: fs.existsSync(pdfPath) ? `/classposter/${stem}.pdf` : null,
        fileName: `${stem}.pdf`
      });
    }

    if (fs.existsSync(jpgPath) && fs.statSync(jpgPath).size > 100) {
      return res.json({
        exists: true,
        size: fs.statSync(jpgPath).size,
        imageUrl: `/classposter/${stem}.jpg`,
        pdfUrl: fs.existsSync(pdfPath) ? `/classposter/${stem}.pdf` : null,
        fileName: `${stem}.pdf`
      });
    }

    if (fs.existsSync(jpegPath) && fs.statSync(jpegPath).size > 100) {
      return res.json({
        exists: true,
        size: fs.statSync(jpegPath).size,
        imageUrl: `/classposter/${stem}.jpeg`,
        pdfUrl: fs.existsSync(pdfPath) ? `/classposter/${stem}.pdf` : null,
        fileName: `${stem}.pdf`
      });
    }

    if (fs.existsSync(webpPath) && fs.statSync(webpPath).size > 100) {
      return res.json({
        exists: true,
        size: fs.statSync(webpPath).size,
        imageUrl: `/classposter/${stem}.webp`,
        pdfUrl: fs.existsSync(pdfPath) ? `/classposter/${stem}.pdf` : null,
        fileName: `${stem}.pdf`
      });
    }

    if (fs.existsSync(pdfPath) && fs.statSync(pdfPath).size > 100) {
      let targetPng = path.join(dir, `${stem}.png`);
      let converted = convertPdfToPng(pdfPath, targetPng);
      if (!converted) {
        const publicDir = path.join(process.cwd(), 'public/classposter');
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
        targetPng = path.join(publicDir, `${stem}.png`);
        converted = convertPdfToPng(pdfPath, targetPng);
      }

      return res.json({
        exists: true,
        size: fs.statSync(pdfPath).size,
        imageUrl: converted && fs.existsSync(targetPng) ? `/classposter/${stem}.png` : `/classposter/${stem}.pdf`,
        pdfUrl: `/classposter/${stem}.pdf`,
        fileName: `${stem}.pdf`
      });
    }
  }

  res.json({ exists: false, size: 0 });
});

app.get("/api/poster-list", (req, res) => {
  const fileSet = new Set<string>();
  for (const dir of searchDirs) {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        files.forEach(f => fileSet.add(f));
      } catch {}
    }
  }
  res.json({ success: true, files: Array.from(fileSet) });
});

app.post("/api/upload-poster", (req, res) => {
  try {
    const { fileName, dataBase64, folder = 'schedule' } = req.body;
    if (!fileName || !dataBase64) {
      return res.status(400).json({ success: false, error: "fileName and dataBase64 required" });
    }

    const cleanBase64 = dataBase64.replace(/^data:(image\/[a-z0-9+]+|application\/pdf);base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    
    if (folder === 'classposter') {
      const classPosterDir = path.join(process.cwd(), 'public/classposter');
      if (!fs.existsSync(classPosterDir)) fs.mkdirSync(classPosterDir, { recursive: true });
      const safeName = path.basename(fileName);
      const ext = path.extname(safeName).toLowerCase();
      const stem = path.basename(safeName, ext);

      const filePath = path.join(classPosterDir, safeName);
      fs.writeFileSync(filePath, buffer);

      let imageUrl: string | null = null;
      if (ext === '.pdf') {
        const pngPath = path.join(classPosterDir, `${stem}.png`);
        convertPdfToPng(filePath, pngPath);
        if (fs.existsSync(pngPath)) {
          imageUrl = `/classposter/${stem}.png`;
        }
      } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        imageUrl = `/classposter/${safeName}`;
      }

      return res.json({
        success: true,
        url: imageUrl || `/classposter/${safeName}`,
        imageUrl,
        pdfUrl: ext === '.pdf' ? `/classposter/${safeName}` : null,
        fileName: safeName
      });
    }

    const targetDir = folder === 'projects' 
      ? path.join(process.cwd(), 'public/images/projects')
      : path.join(process.cwd(), 'public/images/schedule');
    
    const sgfesDir = path.join(process.cwd(), 'public/SGfes');

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    if (!fs.existsSync(sgfesDir)) fs.mkdirSync(sgfesDir, { recursive: true });

    const safeName = path.basename(fileName);
    fs.writeFileSync(path.join(targetDir, safeName), buffer);
    fs.writeFileSync(path.join(sgfesDir, safeName), buffer);

    res.json({
      success: true,
      url: `/images/${folder}/${safeName}`,
      sgfesUrl: `/SGfes/${safeName}`,
      fileName: safeName
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to save poster" });
  }
});

const DEFAULT_CONGESTION_URL =
  "https://docs.google.com/spreadsheets/d/154F3vcdcOSyMc55VbY9qPCey4JtL7mW1pCOWBrDVuZc/edit?gid=0#gid=0";
const DEFAULT_ANNOUNCEMENT_URL =
  "https://docs.google.com/spreadsheets/d/1Ajv5ErGHjhIz740IaB-IqhywYkV66dREwOdk7G3EiEg/edit?gid=0#gid=0";
const DEFAULT_CLASS_PROJECTS_URL =
  "https://docs.google.com/spreadsheets/d/1RgOhPj3OjILxv1oGNzfDxLucK68WbX0T2eNGXpHjdjI/edit?gid=0#gid=0";

let congestionCache: {
  timestamp: number;
  url: string;
  data: Record<string, any>;
} | null = null;

let announcementCache: {
  timestamp: number;
  url: string;
  data: any[];
} | null = null;

let classProjectsCache: {
  timestamp: number;
  url: string;
  data: Record<string, any>;
} | null = null;

function getGoogleSpreadsheetCsvUrl(targetUrl: string): string {
  let fetchUrl = targetUrl.trim();
  if (!fetchUrl.includes("docs.google.com/spreadsheets")) {
    return fetchUrl;
  }
  if (fetchUrl.includes("/pub") && !fetchUrl.includes("output=csv")) {
    return fetchUrl + (fetchUrl.includes("?") ? "&" : "?") + "output=csv";
  }
  const match = fetchUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1] !== "e") {
    const gidMatch = fetchUrl.match(/[#&?]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : "0";
    return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=${gid}`;
  }
  return fetchUrl;
}

function parseFullCSV(text: string): string[][] {
  if (!text || typeof text !== 'string') return [];
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}

function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' && text[i + 1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function checkIsPinned(val: any): boolean {
  if (val === true || val === 1) return true;
  if (!val) return false;
  const str = String(val).trim().toLowerCase();
  return (
    str === 'true' ||
    str === '1' ||
    str === 'yes' ||
    str === 'y' ||
    str === 'on' ||
    str === 't' ||
    str.includes('ピン') ||
    str.includes('固定') ||
    str.includes('重要') ||
    str.includes('○') ||
    str.includes('〇') ||
    str.includes('●') ||
    str.includes('✓') ||
    str.includes('✔') ||
    str.includes('有') ||
    str.includes('はい')
  );
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 2, backoff = 800, timeout = 12000): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      if (response.ok) return response;
    } catch (e: any) {
      clearTimeout(timer);
      if (i === retries) throw e;
    }
    if (i < retries) {
      await new Promise((resolve) => setTimeout(resolve, backoff * (i + 1)));
    }
  }
  throw new Error(`Failed to fetch from ${url} after ${retries + 1} attempts`);
}

async function fetchAndParseGas(targetUrl: string) {
  const fetchUrl = getGoogleSpreadsheetCsvUrl(targetUrl);

  const res = await fetchWithRetry(fetchUrl, {
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/csv,text/plain;q=0.9,*/*;q=0.8",
    },
  });

  const raw = await res.text();
  const rows = parseFullCSV(raw);

  const results: Record<string, any> = {};

  for (let i = 0; i < rows.length; i++) {
    const parts = rows[i];
    if (!parts || parts.length === 0) continue;

    const rawClassCode = parts[0]?.trim() || "";
    const cleaned = rawClassCode.replace(/[\s\-_]/g, "").toUpperCase();
    const classMatch = cleaned.match(/^([0-9])(?:年)?([A-Z])(?:組)?$/);
    if (!classMatch) continue;
    const classCode = `${classMatch[1]}${classMatch[2]}`;

    let statusText = "";
    let waitRaw = "0";
    let detailText = "";

    if (parts.length >= 5 || (parts[1] && /^[a-z0-9]{6,12}$/i.test(parts[1]))) {
      statusText = parts[2]?.trim() || "";
      waitRaw = parts[3]?.trim() || "0";
      detailText = parts[4]?.trim() || "";
    } else {
      statusText = parts[1]?.trim() || "";
      waitRaw = parts[2]?.trim() || "0";
      detailText = parts[3]?.trim() || "";
    }

    const waitNumMatch = waitRaw.match(/(\d+)/);
    const waitMinutes = waitNumMatch ? parseInt(waitNumMatch[1], 10) : 0;

    let level = "smooth";
    if (
      statusText.includes("休") ||
      statusText.includes("終了") ||
      statusText.includes("閉") ||
      statusText.includes("準備") ||
      statusText.includes("中止")
    ) {
      level = "closed";
    } else if (statusText.includes("券") || statusText.includes("整理券")) {
      level = "ticket";
    } else if (statusText.includes("大混") || statusText.includes("混んでいる") || statusText.includes("混雑") || waitMinutes >= 35) {
      level = "crowded";
    } else if (statusText.includes("普通") || statusText.includes("やや") || waitMinutes >= 15) {
      level = "moderate";
    } else if (statusText.includes("空") || statusText.includes("スムーズ") || statusText.includes("なし") || waitMinutes <= 5) {
      level = "smooth";
    }

    results[classCode] = {
      classCode,
      statusText,
      waitTimeMinutes: waitMinutes,
      detailText,
      level,
      rawWait: waitRaw,
    };
  }

  return results;
}

async function fetchAndParseAnnouncements(targetUrl: string) {
  const fetchUrl = getGoogleSpreadsheetCsvUrl(targetUrl);

  const res = await fetchWithRetry(fetchUrl, {
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json,text/csv,text/plain;q=0.9,*/*;q=0.8",
    },
  });

  const raw = await res.text();
  const trimmed = raw.trim();

  if (trimmed.startsWith("[") || (trimmed.startsWith("{") && !trimmed.startsWith("<!DOCTYPE"))) {
    try {
      const parsed = JSON.parse(trimmed);
      const items = Array.isArray(parsed) ? parsed : (parsed.announcements || parsed.data || []);
      if (Array.isArray(items)) {
        const list = items.map((item: any, i: number) => {
          let cat = "一般案内";
          const catStr = (item.category || item.type || "").toString();
          if (catStr.includes("重要")) cat = "重要";
          else if (catStr.includes("混雑")) cat = "混雑情報";
          else if (catStr.includes("プログラム")) cat = "プログラム変更";

          return {
            id: item.id || `ann-${i + 1}`,
            timestamp: item.timestamp || item.date || item.time || new Date().toLocaleString("ja-JP"),
            category: cat,
            title: (item.title || item.name || "").trim(),
            content: (item.content || item.detail || item.body || "").trim(),
            isPinned: checkIsPinned(item.isPinned ?? item.pinned ?? item.pin ?? item.fixed),
          };
        }).filter((a: any) => a.title);

        return list.sort((a: any, b: any) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return 0;
        });
      }
    } catch {
    }
  }

  const rows = parseFullCSV(raw);
  if (rows.length === 0) return [];

  let dateCol = 0;
  let categoryCol = 1;
  let titleCol = 2;
  let contentCol = 3;
  let pinCol = 4;
  let startRow = 1;

  if (rows.length > 0) {
    const headerRow = rows[0].map(h => (h || "").toLowerCase().replace(/\s+/g, ""));
    let foundHeaders = false;
    for (let c = 0; c < headerRow.length; c++) {
      const val = headerRow[c];
      if (val.includes("日") || val.includes("時") || val.includes("date") || val.includes("time")) {
        dateCol = c;
        foundHeaders = true;
      } else if (val.includes("種") || val.includes("区分") || val.includes("カテゴリ") || val.includes("category")) {
        categoryCol = c;
        foundHeaders = true;
      } else if (val.includes("題") || val.includes("タイトル") || val.includes("件名") || val.includes("title")) {
        titleCol = c;
        foundHeaders = true;
      } else if (val.includes("内") || val.includes("本文") || val.includes("詳細") || val.includes("content") || val.includes("body")) {
        contentCol = c;
        foundHeaders = true;
      } else if (val.includes("ピン") || val.includes("固定") || val.includes("pin") || val.includes("優先")) {
        pinCol = c;
        foundHeaders = true;
      }
    }
    if (!foundHeaders) {
      startRow = 0;
    }
  }

  const announcements: any[] = [];
  for (let i = startRow; i < rows.length; i++) {
    const parts = rows[i];
    if (!parts || parts.length < 2) continue;

    const rawTitle = (parts[titleCol] || "").trim();
    if (!rawTitle) continue;

    const rawDate = (parts[dateCol] || "").trim();
    const rawCategory = (parts[categoryCol] || "").trim();
    const rawContent = (parts[contentCol] || "").trim();
    const rawPin = pinCol < parts.length ? parts[pinCol] : false;

    let cat = "一般案内";
    if (rawCategory.includes("重要")) cat = "重要";
    else if (rawCategory.includes("混雑")) cat = "混雑情報";
    else if (rawCategory.includes("プログラム")) cat = "プログラム変更";

    const isPinned = checkIsPinned(rawPin);

    announcements.push({
      id: `ann-live-${i}`,
      timestamp: rawDate || new Date().toLocaleString("ja-JP"),
      category: cat,
      title: rawTitle,
      content: rawContent,
      isPinned,
    });
  }

  return announcements.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });
}

async function fetchAndParseClassProjects(targetUrl: string) {
  const fetchUrl = getGoogleSpreadsheetCsvUrl(targetUrl);
  const res = await fetchWithRetry(fetchUrl, {
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/csv,text/plain;q=0.9,*/*;q=0.8",
    },
  });

  const raw = await res.text();
  const rows = parseFullCSV(raw);
  if (rows.length === 0) return {};

  let classCol = 0;
  let titleCol = 1;
  let catchCol = -1;
  let categoryCol = -1;
  let locationCol = -1;
  let descCol = -1;
  let durationCol = -1;
  let capacityCol = -1;
  let rulesCol = -1;
  let ticketCol = -1;
  let menuCol = -1;
  let startRow = 1;

  if (rows.length > 0) {
    const headerRow = rows[0].map((h) => (h || '').toLowerCase().replace(/\s+/g, ''));
    let foundHeaders = false;
    for (let c = 0; c < headerRow.length; c++) {
      const val = headerRow[c];
      if (val.includes('クラス') || val.includes('組') || val.includes('class') || val.includes('団体')) {
        classCol = c;
        foundHeaders = true;
      } else if (val.includes('タイトル') || val.includes('企画名') || val.includes('title') || val.includes('演目')) {
        titleCol = c;
        foundHeaders = true;
      } else if (val.includes('キャッチ') || val.includes('見出し') || val.includes('一言') || val.includes('catch')) {
        catchCol = c;
        foundHeaders = true;
      } else if (val.includes('カテゴリ') || val.includes('ジャンル') || val.includes('種別') || val.includes('category')) {
        categoryCol = c;
        foundHeaders = true;
      } else if (val.includes('場所') || val.includes('教室') || val.includes('会場') || val.includes('location')) {
        locationCol = c;
        foundHeaders = true;
      } else if (val.includes('説明') || val.includes('詳細') || val.includes('紹介') || val.includes('内容') || val.includes('desc')) {
        descCol = c;
        foundHeaders = true;
      } else if (val.includes('所要') || val.includes('時間') || val.includes('公演') || val.includes('duration')) {
        durationCol = c;
        foundHeaders = true;
      } else if (val.includes('定員') || val.includes('人数') || val.includes('capacity')) {
        capacityCol = c;
        foundHeaders = true;
      } else if (val.includes('注意') || val.includes('ルール') || val.includes('制限') || val.includes('rule')) {
        rulesCol = c;
        foundHeaders = true;
      } else if (val.includes('整理券') || val.includes('チケット') || val.includes('ticket')) {
        ticketCol = c;
        foundHeaders = true;
      } else if (val.includes('料金') || val.includes('メニュー') || val.includes('価格') || val.includes('値段') || val.includes('price')) {
        menuCol = c;
        foundHeaders = true;
      }
    }
    if (!foundHeaders) {
      startRow = 0;
    }
  }

  const results: Record<string, any> = {};

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const rawClass = row[classCol]?.trim() || '';
    const cleaned = rawClass.replace(/[\s\-_]/g, '').toUpperCase();
    const classMatch = cleaned.match(/^([0-9])(?:年)?([A-Z])(?:組)?$/);
    if (!classMatch) continue;

    const classCode = `${classMatch[1]}${classMatch[2]}`;
    const rawTitle = titleCol >= 0 ? (row[titleCol]?.trim() || '') : '';
    if (!rawTitle) continue;

    results[classCode] = {
      classCode,
      title: rawTitle,
      catchphrase: catchCol >= 0 ? (row[catchCol]?.trim() || '') : '',
      category: categoryCol >= 0 ? (row[categoryCol]?.trim() || '') : '',
      location: locationCol >= 0 ? (row[locationCol]?.trim() || '') : '',
      description: descCol >= 0 ? (row[descCol]?.trim() || '') : '',
      duration: durationCol >= 0 ? (row[durationCol]?.trim() || '') : '',
      capacity: capacityCol >= 0 ? (row[capacityCol]?.trim() || '') : '',
      rules: rulesCol >= 0 ? (row[rulesCol]?.trim() || '') : '',
      ticket: ticketCol >= 0 ? (row[ticketCol]?.trim() || '') : '',
      menuPrice: menuCol >= 0 ? (row[menuCol]?.trim() || '') : '',
    };
  }

  return results;
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/congestion-live", async (req, res) => {
  const targetUrl =
    typeof req.query.url === "string" && req.query.url.startsWith("http")
      ? req.query.url
      : DEFAULT_CONGESTION_URL;

  const now = Date.now();
  if (congestionCache && congestionCache.url === targetUrl && now - congestionCache.timestamp < 5000) {
    return res.json({
      success: true,
      timestamp: new Date(congestionCache.timestamp).toISOString(),
      count: Object.keys(congestionCache.data).length,
      data: congestionCache.data,
      cached: true,
    });
  }

  try {
    const data = await fetchAndParseGas(targetUrl);
    const count = Object.keys(data).length;

    congestionCache = {
      timestamp: now,
      url: targetUrl,
      data,
    };

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      count,
      data,
    });
  } catch (error: any) {
    console.error("Error fetching GAS congestion data:", error);
    if (congestionCache && congestionCache.url === targetUrl) {
      return res.json({
        success: true,
        timestamp: new Date(congestionCache.timestamp).toISOString(),
        count: Object.keys(congestionCache.data).length,
        data: congestionCache.data,
        cachedFallback: true,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch and parse GAS live data",
    });
  }
});

app.get("/api/announcements-live", async (req, res) => {
  const targetUrl =
    typeof req.query.url === "string" && req.query.url.startsWith("http")
      ? req.query.url
      : DEFAULT_ANNOUNCEMENT_URL;

  const now = Date.now();
  if (announcementCache && announcementCache.url === targetUrl && now - announcementCache.timestamp < 5000) {
    return res.json({
      success: true,
      timestamp: new Date(announcementCache.timestamp).toISOString(),
      data: announcementCache.data,
      cached: true,
    });
  }

  try {
    const data = await fetchAndParseAnnouncements(targetUrl);
    announcementCache = {
      timestamp: now,
      url: targetUrl,
      data,
    };

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error: any) {
    console.error("Error fetching announcements data:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch announcements live data",
      data: [],
    });
  }
});

app.get("/api/class-projects-live", async (req, res) => {
  const targetUrl =
    typeof req.query.url === "string" && req.query.url.startsWith("http")
      ? req.query.url
      : DEFAULT_CLASS_PROJECTS_URL;

  const now = Date.now();
  if (
    classProjectsCache &&
    classProjectsCache.url === targetUrl &&
    now - classProjectsCache.timestamp < 30000
  ) {
    return res.json({
      success: true,
      timestamp: new Date(classProjectsCache.timestamp).toISOString(),
      data: classProjectsCache.data,
      cached: true,
    });
  }

  try {
    const data = await fetchAndParseClassProjects(targetUrl);
    classProjectsCache = {
      timestamp: now,
      url: targetUrl,
      data,
    };

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (error: any) {
    console.error("Error fetching class projects data:", error);
    if (classProjectsCache && classProjectsCache.url === targetUrl) {
      return res.json({
        success: true,
        timestamp: new Date(classProjectsCache.timestamp).toISOString(),
        data: classProjectsCache.data,
        cachedFallback: true,
      });
    }
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch class projects live data",
      data: {},
    });
  }
});

let serverAppDataStore: any = null;

app.get("/api/app-data", (req, res) => {
  res.json({
    success: true,
    data: serverAppDataStore,
  });
});

app.post("/api/app-data", (req, res) => {
  try {
    const newData = req.body;
    if (newData && typeof newData === 'object') {
      const sanitized = { ...newData };
      delete sanitized.schedules;
      serverAppDataStore = sanitized;
      res.json({ success: true, message: "App data updated successfully on server" });
    } else {
      res.status(400).json({ success: false, error: "Invalid data format" });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to save app data" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
