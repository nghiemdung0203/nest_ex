/* eslint-disable prettier/prettier */
import * as ExcelJS from 'exceljs';

export interface ExportColumn {
    header: string;
    key: string;
    width?: number;
}

export abstract class ExportToExcel {
    /**
     * Generates an Excel file buffer.
     * @param data - The data to be exported.
     * @param columns - Column definitions for the Excel file.
     * @param worksheetName - Name of the worksheet.
     */
    protected async generateExcel<T>(
        data: T[],
        columns: ExportColumn[],
        worksheetName: string = 'Sheet1'
    ): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(worksheetName);

        // Set columns
        worksheet.columns = columns;

        // Add rows
        worksheet.addRows(data);

        // Style the header row
        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
}
