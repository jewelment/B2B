import fs from 'fs';
import csvParser from 'csv-parser';

const CSV_FILE = 'D:\\Google AJ Drive - home\\Maste B2B Jewelement Project\\Jewelment B2B Dev V1\\Testing data\\Inventory data.csv';

async function main() {
  let count = 0;
  fs.createReadStream(CSV_FILE)
    .pipe(csvParser())
    .on('data', (data) => {
      if (count === 0) {
        console.log(Object.keys(data));
      }
      count++;
    });
}
main();
