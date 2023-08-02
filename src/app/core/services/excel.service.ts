import { Injectable } from '@angular/core';
import { ExcelRequest } from '@app/models/excel.model';
import { Workbook } from 'exceljs';
import fs from 'file-saver';

@Injectable()
export class ExcelService {

  constructor() { }

  exportExcel(excelData: ExcelRequest<any>): void {

    // Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers;
    const data: any[] = [];
    excelData.data.forEach((row: any) => {
      data.push(Object.values(row));
    });

    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Export Data');

    if (excelData.deptMemo) {
      worksheet.mergeCells('A1', 'E2');
      worksheet.getCell('C1').value = excelData.deptMemo;
      worksheet.getCell('C1').alignment = {vertical: 'middle', horizontal: 'center'}
      worksheet.getCell('C1').font = {
        size: 20
      }
    }


    // Adding Header Row
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, num) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: '000000' },
        size: 12,

      };
      cell.alignment = {
        horizontal: 'center'
      };
    });

    // Adding Data with Conditional Formatting
    data.forEach((d: any) => worksheet.addRow(d));
    worksheet.columns.forEach(col => col.width = 15);
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((record) => {
      const blob = new Blob([record], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    });

  }

  // Dept Memo Print
  exportDeptMemoExcel(excelData: ExcelRequest<any>): void {

    // Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers;
    const kpiData: any[] = [];
    const coreData: any[] = []
    excelData.data.map((row: any) => {
      if (row.criteria === 'kpi') {
        kpiData.push(Object.values(row));
      } else if (row.criteria === 'core') {
        coreData.push(Object.values(row));
      }
    });

    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Export Data');

    if (excelData.deptMemo) {
      worksheet.mergeCells('B1', 'I1');
      worksheet.mergeCells('A2', 'J2');
      worksheet.mergeCells('A3', 'J3');
      // worksheet.getCell('C1').value = excelData.deptMemo;
      worksheet.getCell('D1').value = "PERFORMANCE MANAGEMENT & DEVELOPMENT FORM"
      worksheet.getCell('D2').value = "Planning, Reviewing and Appraising Performance";
      worksheet.getCell('C1').alignment = {vertical: 'middle', horizontal: 'center'};
      worksheet.getCell('C2').alignment = {vertical: 'middle', horizontal: 'center'};
      worksheet.getCell('D1').font = {
        size: 14,
        bold: true,
      }
    }

    worksheet.addRow([]);
    worksheet.mergeCells('A4', 'J4');
    worksheet.getCell('D4').value = 'Department Information'
    worksheet.getCell('C4').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('C4').font = {
      bold: true
    }

    worksheet.getCell('B5').value = 'Department: ';
    worksheet.getCell('B5').font = {
      bold: true
    }
    worksheet.getCell('C5').value = excelData.deptMemo;
    worksheet.getCell('B6').value = 'Appraisal Date Range: ';
    worksheet.getCell('B6').font = {
      bold: true
    };
    worksheet.getCell('C6').value =`${excelData.startDate} - ${excelData.endDate}`;

    worksheet.addRow([]);
    worksheet.addRow([]);

    worksheet.mergeCells('A9', 'J9')
    worksheet.getCell('D9').value = 'KPIs';
    worksheet.getCell('D9').alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getCell('D9').font = {
      bold: true
    }

    // Adding Header Row
      const kpiHeaderRow = worksheet.addRow(header);

      kpiHeaderRow.eachCell((cell, num) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '' },
          bgColor: { argb: '' },
        };
        cell.font = {
          bold: true,
          color: { argb: '000000' },
          size: 12,

        };
        cell.alignment = {
          horizontal: 'center'
        };
      });

      // Adding Data with Conditional Formatting
      kpiData.forEach((d: any) => {
        worksheet.addRow(d)
      });


      worksheet.columns.forEach(col => col.width = 15);
      if (excelData.totalWtScore) {
        const wtSumTotal = worksheet.addRow(['', '', '', '', '', '', '', '', '', '', excelData.totalWtScore, excelData.possibleWtScore]);
        const percentWtSum = worksheet.addRow(['', '', '', '', '', '', '', '', '', '', '', `${excelData.kpiTotal}%`]);
        const overallKpiPercent = worksheet.addRow(['', '', '', '', '', '', '', '', '', '', 'KPI(E)', `${(Number(excelData.kpiTotal) * 0.9).toFixed(2)}%`]);
        wtSumTotal.font = {
          bold: true
        }
        percentWtSum.font = {
          bold: true
        }
        overallKpiPercent.font = {
          bold: true
        }
      }

      worksheet.addRow([]);
      worksheet.addRow([]);
      worksheet.addRow([]);


      const coreValue = worksheet.addRow(['Core Values'])
      coreValue.alignment = { vertical: 'middle', horizontal: 'center'};
      coreValue.font = {
        bold: true
      };

      const coreHeaderRow = worksheet.addRow(header);

      coreHeaderRow.eachCell((cell, num) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '' },
          bgColor: { argb: '' },
        };
        cell.font = {
          bold: true,
          color: { argb: '000000' },
          size: 12,

        };
        cell.alignment = {
          horizontal: 'center'
        };
      });


      coreData.forEach((d: any) => {
        worksheet.addRow(d)
      });

      worksheet.columns.forEach(col => col.width = 15);
      if (excelData.coreTotal) {
        const coreSumTotal = worksheet.addRow(['', '', '', '', '', '', '', '', '', '', excelData.possibleCoreWtScore, excelData.totalCoreWtSum]);
        const percentWtSum = worksheet.addRow(['', '', '', '', '', '', '', '', '', '', '', `${excelData.coreTotal}%`]);
        const overallCorePercent = worksheet.addRow(['', '', '', '', '', '', '', '', '', '', 'Core(E)', `${(Number(excelData.coreTotal) * 0.1).toFixed(2)}%`]);
        coreSumTotal.font = {
          bold: true
        }
        percentWtSum.font = {
          bold: true
        }
        overallCorePercent.font = {
          bold: true
        }
      }

      worksheet.columns.forEach(col => col.width = 15);
      worksheet.addRow([]);
      if (excelData.coreTotal) {
       const overallPercentage = worksheet.addRow(['', '', '', '', '', '', '', '', '', '', 'Overall Percentage', excelData.percentageTotal]);
       overallPercentage.font = {
        bold: true
       }
      }


      // Generate & Save Excel File
      workbook.xlsx.writeBuffer().then((record) => {
        const blob = new Blob([record], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, title + '.xlsx');
      });

  }
}
