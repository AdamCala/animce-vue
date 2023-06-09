// excelAPI.js

import * as XLSX from "xlsx";

export function processExcelFile() {
  return new Promise((resolve, reject) => {
    const fileURL = process.env.BASE_URL + "animce.xlsx"; // Hardcoded file name and location

    fetch(fileURL)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        var data = new Uint8Array(arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) {
          arr[i] = String.fromCharCode(data[i]);
        }
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        var jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

        console.log(jsonData);

        // Sort the jsonData by the 3rd column value in descending order

        resolve(jsonData);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
