function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // フォームの各 name 属性と一致させます
    var name = e.parameter.name || '';
    var email = e.parameter.email || '';
    var category = e.parameter.category || '';
    var timing = e.parameter.timing || '';
    var message = e.parameter.message || '';
    var timestamp = new Date();

    // スプレッドシートの最終行に追加
    sheet.appendRow([timestamp, name, email, category, timing, message]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
