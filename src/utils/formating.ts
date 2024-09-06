export class StringFormating {
    static makePublinkDocLink(docLink) {
        const docId = docLink.split('https://drive.google.com/open?id=')[1];
        const tempate = `https://drive.google.com/file/d/${docId}/preview`;
        return tempate;
    }
}