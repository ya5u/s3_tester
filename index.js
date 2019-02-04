const S3 = require('aws-sdk/clients/s3');
const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

let credentials = 'credentials.csv';
let region = 'ap-northeast-1';
let Bucket = 'tekcubtset';
let Key = 'testkey'
let file = 'test.text';

const argv = process.argv;
const argv_len = argv.length;
for (let i=0; i<argv_len; i++) {
  switch (argv[i]) {
    case '--credentials':
      credentials = argv[i+1];
      break;
    case '--region':
      region = argv[i+1];
      break;
    case '--bucket':
      Bucket = argv[i+1];
      break;
    case '--key':
      Key = argv[i+1];
      break;
    case '--file':
      file = argv[i+1];
      break;
  }
}

async function main() {
  let cred;
  try {
    const csv = await readFile(credentials, { encoding: 'utf8' });
    cred = parse(csv, {
      columns: true,
      skip_empty_lines: true,
    });
  } catch (err) {
    console.log(err);
  }

  const s3 = new S3({
    apiVersion: '2006-03-01',
    accessKeyId: cred[0]['Access key ID'],
    secretAccessKey: cred[0]['Secret access key'],
  });

  let Body;
  try {
    Body = await readFile(file);
  } catch (err) {
    console.log(err);
  }

  const params = {
    Bucket,
    Key,
    Body,
  };

  try {
    const res = await s3.putObject(params).promise();
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}

main();

