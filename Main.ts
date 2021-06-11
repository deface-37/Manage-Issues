
function onOpen() {
  const ui = SpreadsheetApp.getUi()

  ui.createMenu('Gitlab')
    .addItem('Настроить страницу', 'initSheet')
    .addItem('Импортировать задачи', 'importIssues')
    .addToUi()
}

function initSheet() {
  const sheet = SpreadsheetApp.getActiveSheet()
  // Устанавливаем заголовок
  const titleRow = ['Задача', 'Оценка', 'Затрачено']

  const range = sheet.getRange(1, 1, 1, titleRow.length)

  range.setValues([titleRow])
  range.setFontWeight('bold')

  // Устанавливаем формулы
  const formulaRowNum = 25
  const formulaData = ['Итог:']
  for (let i = 2; i <= 3; i++) {
    const notation = sheet.getRange(2, i, formulaRowNum - 2).getA1Notation()
    formulaData.push(`=SUM(${notation})`)
  }

  const formulaRange = sheet.getRange(formulaRowNum, 1, 1, formulaData.length)
  formulaRange.setValues([formulaData])
  sheet.getRange(formulaRowNum, 1).setFontWeight('bold')
}

/**
 * Преобразует секунды в часы
 * @param {Number} seconds - число секунд
 * @return {Number}
 */
function secondsToHours_(seconds)  {
  return Math.round((seconds / 3600) * 100) / 100
}

function getHyperLink_(issue) {
  let text = '#' + issue.iid
  if (issue.closedAt) {
    text += ' (closed)'
  }

  return SpreadsheetApp.newRichTextValue()
    .setText(text)
    .setLinkUrl(issue.webUrl)
    .build()
}

function importIssues() {
  const sheet = SpreadsheetApp.getActiveSheet()
  
  const issues = getIssues_(sheet.getName())

  const issuesName = issues.map(issue => [getHyperLink_(issue)])
  const issuesDescription = issues.map(issue => [secondsToHours_(issue.timeEstimate), secondsToHours_(issue.totalTimeSpent)])

  const startCoors = {x: 2, y: 1}

  const firstColumn = sheet.getRange(startCoors.x, startCoors.y, issues.length)
  const otherColumns = sheet.getRange(startCoors.x, startCoors.y + 1, issues.length, issuesDescription[1].length)

  firstColumn.setRichTextValues(issuesName)
  firstColumn.setFontColor('black')

  otherColumns.setValues(issuesDescription)
  
}