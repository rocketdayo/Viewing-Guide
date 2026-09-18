function sendStatusByKey(requestKey, status, waitTime, detail) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("status");
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === requestKey) {
      sheet.getRange(i + 1, 3, 1, 3).setValues([[status, waitTime !== "" ? waitTime : 0, detail || ""]]);
      return;
    }
  }
}

function getStatusAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("status");
  if (!sheet) return {};

  const values = sheet.getDataRange().getValues();
  const result = {};

  for (let i = 1; i < values.length; i++) {
    const className = values[i][0];
    if (className) {
      result[className] = {
        status: values[i][2] || "未設定",
        wait: values[i][3] ?? 0,
        detail: values[i][4] || ""
      };
    }
  }
  return result;
}

function doGet(e) {
  try {
    const paramKeys = e && e.parameter ? Object.keys(e.parameter) : [];

    if (paramKeys.length > 0) {
      const requestKey = paramKeys[0];
      
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName("status");
      let matchedClass = null;

      if (sheet) {
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          if (data[i][1] === requestKey) {
            matchedClass = data[i][0];
            break;
          }
        }
      }

      if (!matchedClass) {
        return HtmlService.createHtmlOutput("<h2>無効なアクセスです</h2><p>正しいURLを使用してください。</p>");
      }

      const template = HtmlService.createTemplateFromFile("index");
      template.className = matchedClass;
      template.requestKey = requestKey;
      return template.evaluate()
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
    }

    const template = HtmlService.createTemplateFromFile("view");
    template.data = getStatusAll();
    return template.evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');

  } catch (err) {
    return HtmlService.createHtmlOutput("<h2>エラーが発生しました</h2><pre>" + err + "</pre>");
  }
}