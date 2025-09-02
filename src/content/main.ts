type FixedLengthArray<T, N extends number, A extends any[] = []> = A extends { length: N } ? A : FixedLengthArray<T, N, [ ...A, T ]>

const ratingKanji = ['不', '可', '良', '優', '秀']

const table1 = {
  credits: '',
  gpasum: '',
  gpa: '',
}
let table2: FixedLengthArray<string, 11>[] = []
let table3: FixedLengthArray<string, 3>[] = []

function parse() {
  const tables = (document.querySelector('frame[name=body]') as any).contentDocument.querySelectorAll('table')
  table1.credits = tables[1].querySelectorAll('tr')[2].querySelectorAll('td')[1].innerText
  table1.gpasum = tables[1].querySelectorAll('tr')[3].querySelectorAll('td')[1].innerText
  table1.gpa = tables[1].querySelectorAll('tr')[3].querySelectorAll('td')[2].innerText
  table2 = []
  for (const tr of Array.from(tables[2].querySelectorAll('tr')).slice(1)) {
    table2.push((Array.from((tr as HTMLTableRowElement).querySelectorAll('td')) as HTMLTableCellElement[]).map(td => td.innerText) as FixedLengthArray<string, 11>)
  }
  table3 = []
  for (const tr of Array.from(tables[3].querySelectorAll('tr')).slice(1)) {
    table3.push((Array.from((tr as HTMLTableRowElement).querySelectorAll('td')) as HTMLTableCellElement[]).map(td => td.innerText) as FixedLengthArray<string, 3>)
  }
}

function render() {
  const tables = (document.querySelector('frame[name=body]') as any).contentDocument.querySelectorAll('table')
  tables[1].querySelectorAll('tr')[2].querySelectorAll('td')[1].innerText = table1.credits
  tables[1].querySelectorAll('tr')[3].querySelectorAll('td')[1].innerText = table1.gpasum
  tables[1].querySelectorAll('tr')[3].querySelectorAll('td')[2].innerText = table1.gpa
  tables[2].querySelectorAll('tr').forEach((tr: HTMLTableRowElement, tri: number) => {
    tr.querySelectorAll('td').forEach((td: HTMLTableCellElement, tdi: number) => {
      td.innerText = tdi == 6 ? Number(table2[tri - 1][tdi]).toFixed(1) : table2[tri - 1][tdi]
    })
  })
  tables[3].querySelectorAll('tr').forEach((tr: HTMLTableRowElement, tri: number) => {
    tr.querySelectorAll('td').forEach((td: HTMLTableCellElement, tdi: number) => {
      if (tdi > 0) {
        td.innerText = Number(table3[tri - 1][tdi]).toFixed(1)
      }
    })
  })
}

chrome.runtime.onMessage.addListener((msg) => {
  if ((document.querySelector('frame[name=body]') as any).contentDocument.querySelector('.title')?.innerText !== '単位修得状況照会') return
  const { from, to } = JSON.parse(msg)
  parse()
  
  if (from == 0 && to > 0) {
    for (const row of table2) {
      if (row[10] == '否') {
        row[10] = '合'
        table1.credits = (Number(table1.credits) + Number(row[6])).toFixed(1)
        table3[0][2] = (Number(table3[0][2]) + Number(row[6])).toFixed(1)
        for (const t3row of table3) {
          if (row.slice(1, 4).includes(t3row[0])) {
            t3row[2] = (Number(t3row[2]) + Number(row[6])).toFixed(1)
          }
        }
      }
    }
  } else if (from > 0 && to == 0) {
    for (const row of table2) {
      if (row[9] == ratingKanji[from]) {
        row[10] = '否'
        table1.credits = (Number(table1.credits) - Number(row[6])).toFixed(1)
        table3[0][2] = (Number(table3[0][2]) - Number(row[6])).toFixed(1)
        for (const t3row of table3) {
          if (row.slice(1, 4).includes(t3row[0])) {
            t3row[2] = (Number(t3row[2]) - Number(row[6])).toFixed(1)
          }
        }
      }
    }
  }

  const gpasumOrg = Number(table1.gpasum)
  for (const row of table2) {
    if (row[9] == ratingKanji[from]) {
      row[9] = ratingKanji[to]
      if (table1.gpasum !== '') {
        table1.gpasum = (Number(table1.gpasum) - Number(row[6])*from + Number(row[6])*to).toFixed()
      }
    }
  }
  if (table1.gpasum !== '' && table1.gpa !== '') {
    table1.gpa = (Number(table1.gpa) * Number(table1.gpasum) / gpasumOrg).toFixed(4)
  }

  render()
})
