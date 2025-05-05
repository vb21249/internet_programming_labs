const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static files 
app.use(express.static(path.join(__dirname, 'public')));

// path to get the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Save data from the form in JSON format
app.post('/api/save-json', (req, res) => {
    try {
        const data = req.body;
        const timestamp = new Date().getTime();
        const fileName = `data-${timestamp}.json`;
        const filePath = path.join(__dirname, 'data', fileName);

        // Check if the data directory exists, if not - create it
        if (!fs.existsSync(path.join(__dirname, 'data'))) {
            fs.mkdirSync(path.join(__dirname, 'data'));
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        res.json({
            success: true,
            message: 'Data successfully saved in JSON format',
            fileName: fileName
        });
    } catch (error) {
        console.error('Error saving JSON:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving JSON data',
            error: error.message
        });
    }
});

// Save data from the form in XML format
app.post('/api/save-xml', (req, res) => {
    try {
        const data = req.body;
        const timestamp = new Date().getTime();
        const fileName = `data-${timestamp}.xml`;
        const filePath = path.join(__dirname, 'data', fileName);

        // Check if the data directory exists, if not - create it
        if (!fs.existsSync(path.join(__dirname, 'data'))) {
            fs.mkdirSync(path.join(__dirname, 'data'));
        }

        // JSON to XML conversion
        let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<survey_data>\n';
        for (const [key, value] of Object.entries(data)) {
            xmlContent += `  <${key}>${value}</${key}>\n`;
        }
        xmlContent += '</survey_data>';

        fs.writeFileSync(filePath, xmlContent);

        res.json({
            success: true,
            message: 'Data successfully saved in XML format',
            fileName: fileName
        });
    } catch (error) {
        console.error('Error saving JSON:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving JSON data',
            error: error.message
        });
    }
});


// api to get the list of saved files
app.get('/api/files', (req, res) => {
    try {
        const dataDir = path.join(__dirname, 'data');

        if (!fs.existsSync(dataDir)) {
            return res.json({
                success: true,
                files: []
            });
        }

        const files = fs.readdirSync(dataDir)
            .filter(file => file.endsWith('.json') || file.endsWith('.xml'))
            .map(file => {
                const filePath = path.join(dataDir, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    type: file.endsWith('.json') ? 'json' : 'xml',
                    size: stats.size,
                    createdAt: stats.birthtime
                };
            });

        res.json({
            success: true,
            files: files
        });
    } catch (error) {
        console.error('Error getting list of files', error);
        res.status(500).json({
            success: false,
            message: 'Error getting list of files',
            error: error.message
        });
    }
});

// api to get the content of a specific file
app.get('/api/files/:fileName', (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = path.join(__dirname, 'data', fileName);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');

        if (fileName.endsWith('.json')) {
            res.json({
                success: true,
                fileType: 'json',
                content: JSON.parse(fileContent)
            });
        } else if (fileName.endsWith('.xml')) {
            res.json({
                success: true,
                fileType: 'xml',
                content: fileContent
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Unsupported file type'
            });
        }
    } catch (error) {
        console.error('Error getting file', error);
        res.status(500).json({
            success: false,
            message: 'Error getting file',
            error: error.message
        });
    }
});

// Starting server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});