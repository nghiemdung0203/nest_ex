/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ExportToExcel, ExportColumn } from './export-to-excel.service';

@Injectable()
export class UserExportService extends ExportToExcel {
    /**
     * Exports user data into an Excel file.
     * @param userData - List of user objects to be exported.
     */
    public async exportUserData(userData: { [key: string]: any }[]): Promise<Buffer> {
        const columns: ExportColumn[] = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'username', width: 30 },
            { header: 'AvatarUrl', key: 'avatarUrl', width: 30 },
            { header: 'Permissions', key: 'permissions', width: 30 }
        ];

        return await this.generateExcel(userData, columns, 'Users');
    }
}
