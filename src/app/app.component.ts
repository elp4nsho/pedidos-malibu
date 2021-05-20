import {Component} from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {environment} from "../environments/environment";

export interface Item {
  detalle: String,
  valor: number
}

export interface Cliente {
  nombre: String,
  direccion: String,
  telefono: String,
  objetos: Array<Item>,
}

export interface Boleta {
  fecha: String,
  cliente: Cliente,
  metodoDePago: String,
  metodoDeEnvio: String,
  total: String,

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {

  total = 0;

  cliente: Cliente = {
    direccion: "",
    nombre: "",
    telefono: "",
    objetos: []
  }

  itemVacio: Item = {
    detalle: "",
    valor: 0
  };

  metodoDePago = ""
  metodoDeEnvio = ""

  items: Array<Item> = [];

  constructor() {
    this.sumarItem()
  }


  sumarItem() {
    let newItem: Item = {
      detalle: "",
      valor: undefined
    }
    this.items.push(newItem)
  }

  sumarTotal() {
    let total = 0;
    for (let it of this.items) {
      try {
        total = +it.valor + +total
      } catch (e) {
        console.log(e);
      }
    }
    this.total = total;
  }

  borrar(i) {
    let nuevaLista = []
    for (let it = 0; it < this.items.length; it++) {
      if (it == i) {

      } else {
        nuevaLista.push(this.items[it])
      }
    }
    this.items = nuevaLista

  }


  // tslint:disable-next-line:typedef
  downloadPDF() {


    console.log("los datoooos a pdfiar");
    this.cliente.objetos = this.items;
    let boleta: Boleta = {
      cliente: this.cliente,
      fecha: new Date().toString(),
      total: this.total.toString(),
      metodoDeEnvio: this.metodoDeEnvio,
      metodoDePago: this.metodoDePago
    }
    console.log(boleta);
    const doc = new jsPDF('p', 'pt', 'a4');

    var imgData = environment.foto


    doc.setFontSize(25)
    doc.addImage(imgData, 'JPEG', 15, 40, 500, 700)

    doc.text(35, 55, "Nombre: ")
    doc.text(170, 55, this.cliente.nombre)
    doc.text(35, 95, "Direccion")
    doc.text(170, 95, this.cliente.direccion)
    doc.text(35, 130, "Telefono")
    doc.text(170, 130, this.cliente.telefono)

    doc.setFontSize(20)
    doc.text(130, 160 ,"Detalle")
    doc.text(330, 160 ,"Valor")

    for (let it = 0; it < this.cliente.objetos.length; it++) {
      doc.text(130, 190+it*50, this.cliente.objetos[it].detalle + this.cliente.objetos[it].valor.toString())
      doc.text(330, 190+it*50, this.cliente.objetos[it].valor.toString())
    }
    doc.text(35, (150+this.cliente.objetos.length*30)+50, "TOTAL: "+boleta.total )
    doc.text(35, (150+this.cliente.objetos.length*30)+100, "Metodo de pago:")
    doc.text(135, (150+this.cliente.objetos.length*30)+100, this.metodoDePago )
    doc.text(35, (150+this.cliente.objetos.length*30)+150, "Metodo de envio:")
    doc.text(135, (150+this.cliente.objetos.length*30)+150, this.metodoDeEnvio )



    doc.save("boleta" + this.cliente.nombre + this.cliente.telefono + ".pdf")

    /*  const DATA = document.getElementById('htmlData');
      const doc = new jsPDF('p', 'pt', 'a4');
      const options = {
        background: 'white',
        scale: 3
      };
      html2canvas(DATA, options).then((canvas) => {

        const img = canvas.toDataURL('image/PNG');

        // Add image Canvas to PDF
        const bufferX = 15;
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
        return doc;
      }).then((docResult) => {

        docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
      });*/
  }
}
