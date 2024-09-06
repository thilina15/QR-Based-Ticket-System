import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Injectable } from '@nestjs/common';
require('dotenv').config()
const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_EMAIL,
    key: String(process.env.GOOGLE_PRIVATE_KEY).replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

@Injectable()
export class GoogleSheetService {
    async getRows(data: { offset: number, limit: number }): Promise<Array<GoogleSpreadsheetRow>> {

        await doc.loadInfo(); // loads document properties and worksheets
        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
        const rows = await sheet.getRows({ offset: data.offset, limit: data.limit }) // can also use `doc.sheetsByIndex[0].getRows()`
        const header = sheet.headerValues
        return rows;
    }
}