import { Component, OnInit } from '@angular/core';

import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { PDF_CONFIG, PDF_STYLES, PDF_INFO } from './domains/constants/pdf-configs';
import { LOGO64 } from './domains/constants/logo';
import * as JsBarcode from "JsBarcode";
import { DocDefinition } from './domains/constants/interfaces/doc-definition';
import domtoimage from 'dom-to-image';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  docDefiniton: DocDefinition = {
    content: [
      {
        table: {
          headerRows: 1,
          widths: [75, 80, 80, 80, '*'],
          body: [
            [
              { image: LOGO64, alignment: 'left', width: 75 },
              {
                text:
                  [{ text: 'N° Guia\n\n\n', style: 'box-title' }, { text: '1331', style: 'box-text' }]
              },
              { text: 'Emissão', style: 'box-title' },
              { text: 'Vencimento', style: 'box-title' },
              { text: 'Valor do Documento', style: 'box-title' }],

            [{ text: 'Instrução', style: 'box-title', rowSpan: 4, colSpan: 4 }, '', '', '', { text: 'Desconto', style: 'box-title' }],
            ['', '', '', '', { text: 'Multa', style: 'box-title' }],
            ['', '', '', '', { text: 'Outros Acréscimos', style: 'box-title' }],
            ['', '', '', '', { text: 'Valor Cobrado', style: 'box-title' }],
            [{ text: 'Sacado', style: 'box-title', rowSpan: 5, colSpan: 5 }, '', '', '', ''],
            PDF_INFO.emptyArraySizeFive,
            PDF_INFO.emptyArraySizeFive,
            PDF_INFO.emptyArraySizeFive,
            PDF_INFO.emptyArraySizeFive
          ]
        }
      }
    ],
    styles: PDF_STYLES
  };

  constructor(
    private file: File,
    private fileOpener: FileOpener
  ) { }

  ngOnInit(): void {
    this.generateBarcode();
  }

  exportPdf(): void {
    pdfMake.createPdf(this.docDefiniton).getBuffer(buffer => {
      const blob = new Blob([buffer], { type: PDF_CONFIG.mime });

      this.file.writeFile(this.file.dataDirectory, PDF_CONFIG.filenamePrefix, blob, { replace: true }).then(() => {
        this.fileOpener.open(this.file.dataDirectory + PDF_CONFIG.filenamePrefix, PDF_CONFIG.mime);
      }, err => {
        console.error(err);
      });
    });
  };

  generateBarcode(): void {
      JsBarcode('#barcode', 'Barcode test');
      const svgNode = document.getElementById('barcode');
      domtoimage.toPng(svgNode).then(dataUrl => {
        console.log(dataUrl)
      })
      console.log(document.getElementById('barcode'));
      this.docDefiniton.content.push({ svg: `${document.getElementById('barcode')}`, width: 150})
  }

}
