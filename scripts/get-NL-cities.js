const gunzip = require('gunzip-file');
const http = require('http');
const fs = require('fs');

const options = {
  baseUrl: 'http://bulk.openweathermap.org/sample/',
  archiveName: 'city.list.json.gz',
  unzippedName: 'city.list.json',
  resultName: '../src/components/weather/data/nl.cities.json',
  countryCode: 'NL', // for Netherlands
};

/** Automatic download and processing of country cities */
async function start() {
  try {
    await download();
    await unzipFile();
    await filterCityList();
    await removeUnnecessaryFiles();
  } catch (error) {
    console.log(error);
  }
}

start();

//#region ⏳ Processing Steps

function download() {
  return new Promise((resolve, reject) => {
    try {
      console.log('Downloading data...');
      http.get(options.baseUrl + options.archiveName, res => {
        res
          .pipe(fs.createWriteStream(__dirname + '/' + options.archiveName))
          .on('close', () => {
            console.log('Download complete.');
            resolve();
          });
      });
    } catch (error) {
      reject(error);
    }
  });
}

function unzipFile() {
  return new Promise((resolve, reject) => {
    try {
      console.log('Unzipping...');
      gunzip(
        __dirname + '/' + options.archiveName,
        __dirname + '/' + options.unzippedName,
        () => {
          console.log('Unzipping done.');
          resolve();
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

function filterCityList() {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Filtering ${options.countryCode} cities...`);
      const fileData = fs.readFileSync(
        __dirname + '/' + options.unzippedName,
        'utf8'
      );
      const allCities = JSON.parse(fileData);

      console.log('Cities num:', allCities.length);
      const nlCities = allCities.filter(
        city => city.country === options.countryCode
      );
      console.log('NL cities num:', nlCities.length);

      fs.writeFileSync(
        __dirname + '/' + options.resultName,
        JSON.stringify(nlCities)
      );

      console.log('Filtering completed.');
      console.log(
        '\x1b[1mCheck the resulting JSON file: \x1b[32m%s\x1b[0m',
        fs.realpathSync(__dirname + '/' + options.resultName)
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function removeUnnecessaryFiles() {
  return new Promise((resolve, reject) => {
    try {
      console.log('Removing unnecessary files...');
      fs.unlinkSync(__dirname + '/' + options.unzippedName);
      fs.unlinkSync(__dirname + '/' + options.archiveName);
      console.log('Removed successfully.');
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

//#endregion
