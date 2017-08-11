const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const request = require('request');
const cheerio = require('cheerio');
const Promise = require("bluebird");

const PDF = require('pdfkit');
const fs = require('fs');
const minWordSize = 4;

// Создаем массив промисов, парсим страницы, возвращаем массив с результатами
  router.post('/getdatafrompages', function(req, res){
     let urlList = req.body.data;
     let request = Promise.promisifyAll(require("request"), {multiArgs: true});

      Promise.map(urlList, function(url) {
          return request.getAsync(url).spread(function(response,body) {
            let $ = cheerio.load(body);
            let tags = ["a", "p", "h1", "h2", "h3", "h4", "h5", "span"];
            let resultFromEachTag = [];
            for (let tag = 0; tag < tags.length; tag++){
              let arr = $(tags[tag]).text().split(" ");
              arr = toFormat(arr);
              arr = fixArray(arr);
              resultFromEachTag.push(arr);
            }
            let rsp = getMostRepeating(resultFromEachTag);
            return rsp;

          });
      }).then(function(results) {
           // results is an array of all the parsed bodies in order
           res.send({data: results, urls: urlList});
      }).catch(function(err) {
           // handle error here
           res.send({
             err: err,
             reason: err.cause.code,
             hostname: err.cause.hostname
           });
      });
   });

// Создание PDF файла
   router.post('/generatepdf', function(req, res){
     let content = req.body.data;
     let urls = req.body.urls;
     let fileName = generateFileName();

     try{

       let doc = new PDF();
       doc.pipe(fs.createWriteStream('./files/'+fileName+'.pdf'));
       doc.registerFont('arialCustom', './fonts/arial.ttf');
       doc.font('arialCustom');

       let lineHeigth = 50;
       for (let i = 0; i < urls.length; i++){
         doc.text(urls[i], 50, lineHeigth+30);
         doc.text("Слова: "+content[i], 200, lineHeigth+30);
         lineHeigth+=30;
       }
       doc.end();
       
       res.send({filename: fileName});

     } catch (err){
       res.send({error: err});
     }

   });

// Загрузка PDF на страницу клиента
   router.post('/download', function(req, res){
     let filename = req.body.filename;
     let file = './files/'+filename+'.pdf';
     res.download(file);
   });

//========== Вспомогательные функции =========//

// Возвращает три самых часто повторяющихся слова
function getMostRepeating(arr){
  let resultingArr = [];
  let resultingObj = {};
  let mostRepeating = [];

  // Собираем все в один массив
  for (let i = 0; i < arr.length; i++){
    for (let j = 0; j < arr[i].length; j++){
      resultingArr.push(arr[i][j]);
    }
  }
  // Записываем в объект связки "слово: кол-во повторений"
  for (let i = 0; i < resultingArr.length; i++){
    if (resultingObj[resultingArr[i]] != undefined) continue;
    let counter = 0;
    for (let j = 0; j < resultingArr.length; j++){
      if (resultingArr[i] == resultingArr[j]) counter++;
    }
    resultingObj[resultingArr[i]] = counter;
  }
  // Выбираем три ключа с наибольшими значениями
  for (let i = 0; i < 3; i++){
    let mostRepeatedWord = "";
    let count = 0;
    for (let word in resultingObj){
      if (count < resultingObj[word]){
        count = resultingObj[word];
        mostRepeatedWord = word;
      }
    }
    mostRepeating.push(mostRepeatedWord);
    resultingObj[mostRepeatedWord] = 0;
  }

  return mostRepeating;
}

// Убирает все лишние символы
function toFormat(arr){
  let result = [];
  for (let i = 0; i < arr.length; i++){
    let str = trimmer(arr[i]);
    if(str.length > minWordSize){
        result.push(str);
    }
  }

  function trimmer(str){
    let result = str.replace(/[^a-zA-ZА-Яа-яЁё]/gi,'').replace(/\s+/gi,', ');
    return result;
  }

  return result;
}

// Создает имя файла
function generateFileName(){
  let str = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 20; i++){
    str += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return str;
}

// Распознает и парсит склееные слова
function fixArray(arr){
	let resultingArray = [];
	for (let i = 0; i < arr.length; i++){
			let first = 0;
			for (let k = 0; k < arr[i].length; k++){
				if (k == 0){
					continue;
				} else if (isUpperCase(arr[i].charAt(k)) == false){
  					if (k == arr[i].length-1){
  						resultingArray.push(arr[i].substring(first, k+1));
  					}
					continue;
				} else if (isUpperCase(arr[i].charAt(k)) == true){
  					resultingArray.push(arr[i].substring(first, k));
  					first = k;
				}
			}
	}

	function isUpperCase(symbol){
		return symbol == symbol.toUpperCase();
	}

  let result = [];
  for (let i = 0; i < resultingArray.length; i++){
    if (resultingArray[i].length > minWordSize){
      result.push(resultingArray[i].toLowerCase());
    }
  }

	return result;
}

module.exports = router;
