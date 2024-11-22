/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ExportToExcel, ExportColumn } from './export-to-excel.service';

@Injectable()
export class UserExportService extends ExportToExcel {
    /**
     * Exports user data into an Excel file with proper text wrapping and formatting.
     * @param userData - List of user objects to be exported.
     */
    public async exportUserData(userData: { [key: string]: any }[]): Promise<Buffer> {
        const columns: ExportColumn[] = [
            { header: 'ID', key: 'id', width: 10, middleAlign: true, centerContent: true },
            { header: 'Name', key: 'username', width: 30, middleAlign: true, centerContent: true },
            { 
                header: 'Avatar URL', 
                key: 'avatarUrl',
                width: 30, 
                wrapText: true,
                middleAlign: false,
                centerContent: false
            },
            { 
                header: 'Permissions', 
                key: 'permissions', 
                width: 30, 
                wrapText: true,
                middleAlign: false,
                centerContent: false
            }
        ];

        return await this.generateExcel(userData, columns, 'Users');
    }
}