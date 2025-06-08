import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const createExcelFile = (excelPropertiesObj) => {
    return new Promise((resolve, reject) => {
        const { excelData, fileName, sheetView, sheetColumns, header, headerRowsCount, isMergeCell, addRowObj, mergeCellsArr, finalPriceSum, countSum, isMaterialPage, totalRowMaterialSum, rowMaterialCalculationData } = excelPropertiesObj;
        // create new workbook
        const workbook = new ExcelJS.Workbook();
        // create a sheet with red tab colour
        //Use the second parameter of the addWorksheet function to specify options for the worksheet.FFC0000
        const sheet = workbook.addWorksheet(fileName, {
            properties: { tabColor: { argb: "FFFFFF" } },
        });

        /* Worksheet Views⬆
        // Worksheets now support a list of views, that control how Excel presents the sheet:
        // frozen - where a number of rows and columns to the top and left are frozen in place. Only the bottom right section will scroll
        // split - where the view is split into 4 sections, each semi-independently scrollable. **/
        sheet.views = sheetView;
        sheet.getRow(1).values = header;

        // Add column headers and define column keys and widths
        // Note: these column structures are a workbook-building convenience only,
        // apart from the column width, they will not be fully persisted.
        sheet.columns = sheetColumns;

        if (addRowObj && addRowObj.length > 0) {
            addRowObj.forEach(function (item, index) {
                sheet.addRow(item);
            });
        }
        // if(header){

        //     sheet.headerFooter.differentFirst = true;
        //     sheet.headerFooter.firstHeader = "Hello Exceljs";
        //     // sheet.addRow()
        // }




        // Add a couple of Rows by key-value, after the last current row, using the column keys
        //sheet.addRow({name:'name', department: 'department', designation: 'designation'});
        // merge a range of cells
        if (isMergeCell) {
            mergeCellsArr.forEach((element) => {
                sheet.mergeCells(element);
                sheet.getRow(element.split(":")[0]).alignment = {
                    vertical: "top",
                    horizontal: "center",
                };
            });
            // Get a row object.
            // sheet.getRow("A1", "B1", "M1").alignment = {
            // vertical: "top",
            // horizontal: "center"};
        }

        sheet.addRows(excelData);
        if (finalPriceSum) {

            sheet.addRow({ partName: "Total", finalPrice: parseInt(finalPriceSum), count: parseInt(countSum) });
            const totalRow = sheet.lastRow;
            totalRow.getCell("A").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
            totalRow.getCell("B").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
            totalRow.getCell("C").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
            totalRow.getCell("D").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
        }
        if (totalRowMaterialSum) {

            sheet.addRow({
                partName: "Total",
                resin: parseInt(totalRowMaterialSum?.resin),
                fiber: parseInt(totalRowMaterialSum?.fiber),
                getcoat: parseInt(totalRowMaterialSum?.getcoat),
                sandingDisc: parseInt(totalRowMaterialSum?.sandingDisc),
                primerGrey: parseInt(totalRowMaterialSum?.primerGrey),
                primerGreen: parseInt(totalRowMaterialSum?.primerGreen),
                puBlackPaint: parseInt(totalRowMaterialSum?.puBlackPaint),
                thinner: parseInt(totalRowMaterialSum?.thinner),
                putti: parseInt(totalRowMaterialSum?.putti)
            });
            const totalRow = sheet.lastRow;
            totalRow.getCell("A").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
            totalRow.getCell("B").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
            totalRow.getCell("C").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
            totalRow.getCell("D").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
            totalRow.getCell("E").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
            totalRow.getCell("F").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
            totalRow.getCell("G").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
            totalRow.getCell("H").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
            totalRow.getCell("I").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
            totalRow.getCell("J").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
            totalRow.getCell("K").fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" }, // Yellow color
            };
        }

        if (rowMaterialCalculationData) {

            const totalRow = sheet.addRow({
                barCode: "Total Issued Raw Material Quantity",
                part: rowMaterialCalculationData?.totalRowMaterialQuantity || 0
            });
            const estimatedRow = sheet.addRow({
                barCode: "Estimated Raw Material Quantity",
                part: rowMaterialCalculationData?.sumOfusedRowMaterialQuantity || 0
            });
            const remainingRow = sheet.addRow({
                barCode: "Remaing Issued Raw Material Quantity",
                part: rowMaterialCalculationData?.remaingRowMaterialQuantity || 0
            });

            const fillStyle = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF99' } // Light yellow
            };

            const borderStyle = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            
            // Apply the style to each cell in the last 3 rows
            [totalRow, estimatedRow, remainingRow].forEach(row => {
                row.eachCell(cell => {
                    cell.fill = fillStyle;
                    cell.border = borderStyle;
                });
            });
            // const totalRow = sheet.lastRow;
            // totalRow.getCell("A").fill = {
            //     type: "pattern",
            //     pattern: "solid",
            //     fgColor: { argb: "FFFF00" }, // Yellow color
            // };
            // totalRow.getCell("B").fill = {
            //     type: "pattern",
            //     pattern: "solid",
            //     fgColor: { argb: "FFFF00" }, // Yellow color
            // };
            // totalRow.getCell("C").fill = {
            //     type: "pattern",
            //     pattern: "solid",
            //     fgColor: { argb: "FFFF00" }, // Yellow color
            // };
            // totalRow.getCell("D").fill = {
            //     type: "pattern",
            //     pattern: "solid",
            //     fgColor: { argb: "FFFF00" }, // Yellow color
            // };
            // totalRow.getCell("E").fill = {
            //     type: "pattern",
            //     pattern: "solid",
            //     fgColor: { argb: "FFFF00" }, // Yellow color
            // };
            // totalRow.getCell("F").fill = {
            //     type: "pattern",
            //     pattern: "solid",
            //     fgColor: { argb: "FFFF00" }, // Yellow color
            // };
            // totalRow.getCell("G").fill = {
            //     type: "pattern",
            //     pattern: "solid",
            //     fgColor: { argb: "FFFF00" }, // Yellow color
            // };
            // totalRow.getCell("H").fill = {
            //     type: "pattern",
            //     pattern: "solid",
            //     fgColor: { argb: "FFFF00" }, // Yellow color
            // };
            // totalRow.getCell("I").fill = {
            //     type: "pattern",
            //     pattern: "solid",
            //     fgColor: { argb: "FFFF00" }, // Yellow color
            // };
            // totalRow.getCell("J").fill = {
            //     type: "pattern",
            //     pattern: "solid",
            //     fgColor: { argb: "FFFF00" }, // Yellow color
            // };
            // totalRow.getCell("K").fill = {
            //     type: "pattern",
            //     pattern: "solid",
            //     fgColor: { argb: "FFFF00" }, // Yellow color
            // };
        }
        if (header) {
            if (finalPriceSum) {
                sheet.insertRow(1, []);
                sheet.mergeCells('A1:D1');
                sheet.getCell('A1').value = header
            } else if (isMaterialPage) {
                sheet.insertRow(1, []);
                sheet.mergeCells('A1:B1');
                sheet.getCell('A1').value = header
            }
        }
 
        // Iterate over all rows that have values in a worksheet
        sheet.eachRow(function (row, rowNumber) {
            if (rowNumber <= headerRowsCount) {
                row.eachCell({ includeEmpty: false }, function (cell, _colNumber) {
                    cell.fill = {
                        bold: true,
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "1C2D61" },
                        bgColor: { argb: "1C2D61" },
                    };

                    cell.border = {
                        right: { style: "thin" },
                        bottom: { style: "thin" },
                    };

                    cell.font = {
                        color: { argb: "FFFFFF" },
                        bold: true,
                    };
                });
            }
            row.alignment = {
                wrapText: true,
                vertical: "middle",
                horizontal: "center",
            };
        });

        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
            });
            saveAs(blob, fileName);
            resolve();
        }).catch((err) => reject());
    })
};

export const downloadExcel = () => { };

// Export to pdf
/*const downloadPdf =(columns,data,fileName)=>{
    // const unit = "pt";
    // const size = "A4"; // Use A1, A2, A3 or A4
    // const orientation = "portrait"; // portrait or landscape
    // const marginLeft = 40;
    //const doc = new jsPDF(orientation, unit, size)
    // let aa = columns.filter(x => x.id !== 'expander' && x.id !== 'actions')
    // .map(col => ({ header: col.Header, dataKey: col.accessor }));
    const doc = new jsPDF()
    doc.text("Inward", 20, 10)
    doc.autoTable({
        theme: "grid",
        columns: columns.filter(x => x.id !== 'expander' && x.id !== 'actions')
        .map(col => ({ header: col.Header, dataKey: col.accessor })),
        body: data
    })
    doc.save(`${fileName}.pdf`);
} */

//============================================
