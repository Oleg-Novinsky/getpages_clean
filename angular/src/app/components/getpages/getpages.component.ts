import { Component, OnInit } from '@angular/core';
import {GetpagesService} from '../../services/getpages.service';
import {AuthService} from '../../services/auth.service';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';

const FileSaver = require('file-saver');

@Component({
  selector: 'app-getpages',
  templateUrl: './getpages.component.html',
  styleUrls: ['./getpages.component.css']
})
export class GetpagesComponent implements OnInit {

// Переменные для привязки к шаблону
  sitesArr = [];
  loadStatus = "";
  isLoading = false;
  errorMessage = {
    code: "",
    hostname: ""
  };

  constructor(
    private router:Router,
    private http:Http,
    private getpagesService:GetpagesService,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.addInput();
  }

  // Отправляем массив с адресами на сервер
  getDataFromPages(){
      this.startLoading();
      this.loadStatus = "Идет парсинг страниц...";
      let rq = formSitesArray(this.sitesArr);

      this.getpagesService.getDataFromPages(rq).subscribe(data => {
        if (data.reason != undefined){
          this.errorMessage = data;
          this.loadStatus = "Не удалось распарсить одну или более страниц. "+"Reason: "+data.reason+", Hostname: "+data.hostname;
          this.stopLoading();
        } else{

          this.generatePdf(data);
          this.loadStatus = "Создание PDF файла...";
        }
      });

      function formSitesArray(sitesArr){
        let arr = [];
        for (let i = 0; i < sitesArr.length; i++){
          if (sitesArr[i].site.indexOf("http://") < 0){
            let str = "http://"+sitesArr[i].site;
            arr.push(str);
            continue;
          }
          arr.push(sitesArr[i].site);
        }
        return {data: arr};
      }
  }

  // Создание PDF файл
  generatePdf(rq){
    this.getpagesService.gneratePdf(rq).subscribe(data => {
      if (data.error != undefined){
        this.loadStatus = "Не удалось сгенерировать PDF файл";
        this.stopLoading();
      } else{

        this.delayDownloading(data);
        this.loadStatus = "Загрузка PDF файла...";
      }
    });
  }

// Ждем, пока файл окончательно сформируется
  delayDownloading(data){
    let scope = this;
    setTimeout(function(){scope.getPdf(data)}, 1000);
  }

  // Скачивание файла
  getPdf(filename) {
  this.getpagesService.getPdf(filename)
      .subscribe(res => {
          FileSaver.saveAs(res,"Result.pdf");
          let fileURL = URL.createObjectURL(res);
          window.open(fileURL);
          this.stopLoading();
      })
  }

// Индикация загрузки
startLoading(){
  if (this.isLoading == false){
    this.isLoading = true;
  } else{
    this.isLoading = false;
  }
}

stopLoading(){
  let scope = this;
  setTimeout(function(){scope.isLoading = false}, 5000);
}

// Удаление поля ввода
deleteInput(name){
    let newArr = [];
    for (let i = 0; i < this.sitesArr.length; i++){
      if (this.sitesArr[i].name != name ){
        newArr.push({name: this.sitesArr[i].name, site: this.sitesArr[i].site});
      }
    }
    this.sitesArr = newArr;
}

// Добавление поля ввода
addInput(){
  let obj = {
    name: generateName(),
    site: ""
  };
  this.sitesArr.unshift(obj);

  function generateName(){
    let str = "";
    let possible = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 5; i++){
      str += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return str;
  }
}

onLogout(){
  this.authService.logout();
  this.router.navigate(['/login']);
}

}
