import {Injectable} from '@angular/core';
import b64toBlob from 'b64-to-blob';
import {ObjectHelper} from "../helpers/object.helper";

@Injectable({providedIn: 'root'})
export class FileService {


  downloadFile(fileName: string, mimetype: string, base64Content) {
    const blob = b64toBlob(base64Content, mimetype);
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  }

  readonly MIME_BY_EXT: Record<string, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    txt: 'text/plain',
    csv: 'text/csv',
    json: 'application/json',
    zip: 'application/zip',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };

  private guessMimeType(fileName: string): string {
    const m = fileName?.toLowerCase().match(/\.([a-z0-9]+)$/);
    if (ObjectHelper.isDefined(m)) {
      return this.MIME_BY_EXT[m[1]] || 'application/octet-stream'
    }
    return 'application/octet-stream';

  }

  guessTypeAndDownloadFile(fileName: string, base64Content: string) {
    this.downloadFile(fileName, this.guessMimeType(fileName), base64Content);
  }
}
