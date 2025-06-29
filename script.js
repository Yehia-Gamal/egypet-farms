function formatNumber(num) {
  return (+num).toLocaleString("en-US");
}

function calculate() {
  const count = +document.getElementById("chickCount").value;
  const chickPrice = +document.getElementById("chickPrice").value;
  const feedCost = +document.getElementById("feedCost").value;
  const sellPerKilo = +document.getElementById("sellPerKilo").value;
  const weight = 2;
  const feedPerChick = 3;
  const serviceCost = 10;

  if (!(count && chickPrice && feedCost && sellPerKilo))
    return alert("يرجى ملء جميع البيانات");

  const survivors = count < 10 ? count : Math.floor(count * 0.95);
  const totalChickCost = count * chickPrice;
  const totalFeedCost = survivors * feedPerChick * feedCost;
  const totalServiceCost = count * serviceCost;
  const totalCost = totalChickCost + totalFeedCost + totalServiceCost;
  const revenue = survivors * weight * sellPerKilo;
  const profit = revenue - totalCost;
  const profitPerChick = profit / survivors;

  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${formatNumber(count)}</td>
        <td>${formatNumber(totalChickCost)}</td>
        <td>${formatNumber(totalFeedCost)}</td>
        <td>${formatNumber(totalServiceCost)}</td>
        <td>${formatNumber(totalCost)}</td>
        <td>${formatNumber(revenue)}</td>
        <td>${formatNumber(profitPerChick.toFixed(0))}</td>
        <td>${formatNumber(profit)}</td>
        <td><button onclick="this.closest('tr').remove()">🗑️</button></td>
      `;
  document.getElementById("resultsBody").appendChild(row);
}

function clearAll() {
  document.getElementById("resultsBody").innerHTML = "";
}

document.getElementById("excelBtn").addEventListener("click", function () {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.table_to_sheet(document.getElementById("resultTable"));
  XLSX.utils.book_append_sheet(wb, ws, "نتائج الدواجن");
  XLSX.writeFile(wb, "poultry-results.xlsx");
});

document.getElementById("pdfBtn").addEventListener("click", function () {
  const doc = {
    content: [
      {
        text: "📄 تقرير أرباح مشروع الدواجن",
        style: "header",
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          headerRows: 1,
          widths: Array(9).fill("*"),
          body: [
            [
              "عدد الكتاكيت",
              "تكلفة الكتاكيت",
              "تكلفة العلف",
              "الخدمات",
              "التكلفة الإجمالية",
              "الإيراد",
              "ربح/فرخة",
              "صافي الربح",
              "",
            ],
            ...[...document.querySelectorAll("#resultsBody tr")].map((row) =>
              [...row.children].map((cell) => cell.textContent)
            ),
          ],
        },
        layout: "lightHorizontalLines",
      },
    ],
    defaultStyle: {
      fontSize: 12,
      alignment: "center",
    },
    styles: {
      header: { fontSize: 16, bold: true },
    },
  };
  pdfMake.createPdf(doc).download("poultry-report.pdf");
});

function downloadScreenshot() {
  const element = document.getElementById("resultTable");
  html2canvas(element).then((canvas) => {
    const link = document.createElement("a");
    link.download = "poultry-results.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
