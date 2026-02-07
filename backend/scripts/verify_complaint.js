const http = require('http');
const fs = require('fs');
const path = require('path');
const Bus = require('../models/Bus');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const bus = await Bus.findOne();
        if (!bus) {
            console.error('No buses found for testing.');
            process.exit(1);
        }

        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        const hostname = 'localhost';
        const port = 5000;
        const path = '/api/complaint';

        const postData = [
            `--${boundary}`,
            `Content-Disposition: form-data; name="busId"`,
            '',
            bus._id.toString(),
            `--${boundary}`,
            `Content-Disposition: form-data; name="type"`,
            '',
            'Delay',
            `--${boundary}`,
            `Content-Disposition: form-data; name="description"`,
            '',
            'Test complaint from script',
            `--${boundary}--`,
            ''
        ].join('\r\n');

        const options = {
            hostname,
            port,
            path,
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                console.log('No more data in response.');
                process.exit(res.statusCode === 201 ? 0 : 1);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            process.exit(1);
        });

        // Write data to request body
        req.write(postData);
        req.end();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verify();
