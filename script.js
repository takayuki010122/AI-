function doPost(e) {
  try {
    var params = e.parameter;
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // スプレッドシートの最終行にデータを追加
    sheet.appendRow([
      new Date(),       // 日時
      params.name,      // お名前
      params.email,     // メールアドレス
      params.topic,     // ご相談内容
      params.timing,    // 時期
      params.message    // 詳細メッセージ
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
