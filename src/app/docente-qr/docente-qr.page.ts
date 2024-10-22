import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { toDataURL } from 'qrcode';
import { saveAs } from 'file-saver'; // Asegúrate de instalar file-saver

@Component({
  selector: 'app-docente-qr',
  templateUrl: './docente-qr.page.html',
  styleUrls: ['./docente-qr.page.scss'],
})
export class DocenteQrPage implements OnInit {
  asignaturas = [
    'ESTADISTICA DESCRIPTIVA_005D',
    'INGLES INTERMEDIO_018D',
    'PROGRAMACION DE APLICACIONES MOVILES_003D',
    'ARQUITECTURA_002D',
    'CALIDAD DE SOFTWARE_002D',
    'ETICA PARA EL TRABAJO_006D',
    'PROCESO DE PORTAFOLIO 4_004D',
  ];

  scannedCode: string | null = null;
  qrCodeDataUrl: string | null = null;
  qrGenerationTime: string | null = null;
  countdown: number = 120; // 2 minutes in seconds
  timer: any;
  qrHistory: any[] = [];
  scannedHistory: any[] = [];
  customText: string = ''; // Para personalizar el QR
  expirationTime: number = 120; // Tiempo de expiración predeterminado

  constructor() {}

  ngOnInit() {
    this.loadQRCodeHistory();
    this.loadScannedHistory();
  }

  selectSubject(asignatura: string) {
    console.log('Asignatura seleccionada:', asignatura);
    const localIp = 'http://192.168.56.1';
    const link = `${localIp}/${asignatura.replace(/\s+/g, '-')}`;
    this.generateQRCode(link);
    this.startTimer();
  }

  async generateQRCode(link: string) {
    try {
      const qrLink = this.customText ? `${link} - ${this.customText}` : link;
      this.qrCodeDataUrl = await toDataURL(qrLink);
      this.qrGenerationTime = this.getCurrentDateTime();
      this.saveQRCodeToHistory(qrLink, this.qrGenerationTime);
    } catch (error) {
      console.error('Error al generar el código QR:', error);
    }
  }

  startTimer() {
    this.countdown = this.expirationTime;
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.qrCodeDataUrl = null;
        console.log('El tiempo ha expirado.');
      }
    }, 1000);
  }

  async scanBarcode() {
    try {
      const result = await BarcodeScanner.scan();
      this.scannedCode = (result as any).rawValue || 'No se encontró valor en el código';
      this.scannedHistory.push({ code: this.scannedCode, time: this.getCurrentDateTime() });
      localStorage.setItem('scannedHistory', JSON.stringify(this.scannedHistory));
      console.log('Código escaneado:', this.scannedCode);
    } catch (error) {
      console.error('Error al escanear el código:', error);
    }
  }

  saveQRCodeToHistory(link: string, time: string) {
    const history = JSON.parse(localStorage.getItem('qrHistory') || '[]');
    history.push({ link, time });
    localStorage.setItem('qrHistory', JSON.stringify(history));
  }

  loadQRCodeHistory() {
    this.qrHistory = JSON.parse(localStorage.getItem('qrHistory') || '[]');
  }

  loadScannedHistory() {
    this.scannedHistory = JSON.parse(localStorage.getItem('scannedHistory') || '[]');
  }

  deleteQRCode(index: number) {
    this.qrHistory.splice(index, 1);
    localStorage.setItem('qrHistory', JSON.stringify(this.qrHistory));
  }

  deleteScannedCode(index: number) {
    this.scannedHistory.splice(index, 1);
    localStorage.setItem('scannedHistory', JSON.stringify(this.scannedHistory));
  }

  getCurrentDateTime() {
    return new Date().toLocaleString();
  }

  exportHistory() {
    const csvData = this.qrHistory.map(qr => `${qr.link},${qr.time}`).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'qr_history.csv');
  }


}
