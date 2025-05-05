
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // All tabs - inactive
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Selected tab - active
        tab.classList.add('active');
        document.getElementById(`${tab.dataset.tab}-content`).classList.add('active');
    });
});

// Getting data obj from the form
function getFormData() {
    const form = document.getElementById('data-form');
    return {
        'full-name': form.querySelector('#full-name').value,
        'email': form.querySelector('#email').value,
        'age-group': form.querySelector('#age-group').value,
        'gender': form.querySelector('#gender').value,
        'feedback': form.querySelector('#feedback').value
    };
}

// Form populating from object 
function populateForm(data) {
    const form = document.getElementById('data-form');
    form.querySelector('#full-name').value = data['full-name'] || '';
    form.querySelector('#email').value = data['email'] || '';
    form.querySelector('#age-group').value = data['age-group'] || '';
    form.querySelector('#gender').value = data['gender'] || '';
    form.querySelector('#feedback').value = data['feedback'] || '';
}

// Form data to JSON
function updateJson() {
    const data = getFormData();
    const jsonStr = JSON.stringify(data, null, 2);
    document.getElementById('json-textarea').value = jsonStr;
}

// Form data to XML
function updateXml() {
    const data = getFormData();
    let xmlStr = '<survey_data>\n';
    for (const [key, value] of Object.entries(data)) {
        xmlStr += `  <${key}>${value}</${key}>\n`;
    }
    xmlStr += '</survey_data>';
    document.getElementById('xml-textarea').value = xmlStr;
}

// Form Populating with JSON/XML
function populateFormFromCode() {
    const activeTab = document.querySelector('.tab.active').dataset.tab;

    if (activeTab === 'json') {
        try {
            const jsonStr = document.getElementById('json-textarea').value;
            const data = JSON.parse(jsonStr);
            populateForm(data);
        } catch (e) {
            alert('JSON parsing error: ' + e.message);
        }
    } else if (activeTab === 'xml') {
        try {
            const xmlStr = document.getElementById('xml-textarea').value;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlStr, 'text/xml');

            const data = {};
            const elements = xmlDoc.getElementsByTagName('survey_data')[0].children;

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                data[element.tagName] = element.textContent;
            }

            populateForm(data);
        } catch (e) {
            alert('XML parsing error: ' + e.message);
        }
    }
}

function handleFileUpload() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        alert('Select file.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const fileContent = e.target.result;

        if (file.name.endsWith('.json')) {
            // JSON
            try {
                const data = JSON.parse(fileContent);
                populateForm(data);
                document.getElementById('json-textarea').value = JSON.stringify(data, null, 2);
                // JSON tab switch
                document.querySelector('.tab[data-tab="json"]').click();
            } catch (e) {
                alert('JSON parsing error: ' + e.message);
            }
        } else if (file.name.endsWith('.xml')) {
            // XML
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(fileContent, 'text/xml');

                const data = {};
                const elements = xmlDoc.getElementsByTagName('survey_data')[0].children;

                for (let i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    data[element.tagName] = element.textContent;
                }

                populateForm(data);
                document.getElementById('xml-textarea').value = fileContent;
                // XML tab switch
                document.querySelector('.tab[data-tab="xml"]').click();
            } catch (e) {
                alert('XML parsing error: ' + e.message);
            }
        } else {
            alert('Unsupported file type :( Try xml or json.');
        }
    };

    reader.readAsText(file);
}

// EXPORT
function exportJsonFile(content, fileName) {
    try {
        JSON.parse(content); // Validate JSON before export
        const blob = new Blob([content], { type: 'application/json' });
        downloadFile(blob, fileName);
    } catch (e) {
        alert('Cannot export invalid JSON: ' + e.message);
    }
}

function exportXmlFile(content, fileName) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'text/xml');
        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            throw new Error('Invalid XML structure');
        }
        const blob = new Blob([content], { type: 'text/xml' });
        downloadFile(blob, fileName);
    } catch (e) {
        alert('Cannot export invalid XML: ' + e.message);
    }
}

function downloadFile(blob, fileName) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


// Server API integration
function saveToServer(type) {
    const endpoint = type === 'json' ? '/api/save-json' : '/api/save-xml';
    const data = getFormData();

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert(`Data successfully saved as ${type.toUpperCase()} on server: ${result.fileName}`);
            } else {
                alert(`Error saving ${type.toUpperCase()}: ${result.message}`);
            }
        })
        .catch(error => {
            alert(`Network error when saving ${type.toUpperCase()}: ${error.message}`);
        });
}

function loadServerFiles() {
    fetch('/api/files')
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const fileList = document.getElementById('server-files-list');
                if (!fileList) return;

                fileList.innerHTML = '';

                if (result.files.length === 0) {
                    fileList.innerHTML = '<li>No files found on server</li>';
                    return;
                }

                result.files.forEach(file => {
                    const li = document.createElement('li');
                    li.textContent = `${file.name} (${file.type}) - `;

                    const loadBtn = document.createElement('button');
                    loadBtn.textContent = 'Load';
                    loadBtn.addEventListener('click', () => loadFileFromServer(file.name));

                    li.appendChild(loadBtn);
                    fileList.appendChild(li);
                });
            } else {
                console.error('Failed to load server files:', result.message);
            }
        })
        .catch(error => {
            console.error('Network error when loading files:', error);
        });
}

function loadFileFromServer(fileName) {
    fetch(`/api/files/${fileName}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                if (result.fileType === 'json') {
                    populateForm(result.content);
                    document.getElementById('json-textarea').value = JSON.stringify(result.content, null, 2);
                    document.querySelector('.tab[data-tab="json"]').click();
                } else if (result.fileType === 'xml') {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(result.content, 'text/xml');

                    const data = {};
                    const elements = xmlDoc.getElementsByTagName('survey_data')[0].children;

                    for (let i = 0; i < elements.length; i++) {
                        const element = elements[i];
                        data[element.tagName] = element.textContent;
                    }

                    populateForm(data);
                    document.getElementById('xml-textarea').value = result.content;
                    document.querySelector('.tab[data-tab="xml"]').click();
                }
            } else {
                alert(`Error loading file: ${result.message}`);
            }
        })
        .catch(error => {
            alert(`Network error when loading file: ${error.message}`);
        });
}


// Events binding
document.getElementById('update-json-btn').addEventListener('click', updateJson);
document.getElementById('update-xml-btn').addEventListener('click', updateXml);
document.getElementById('populate-form-btn').addEventListener('click', populateFormFromCode);
document.getElementById('parse-file-btn').addEventListener('click', handleFileUpload);

document.getElementById('export-json-btn').addEventListener('click', () => {
    const content = document.getElementById('json-textarea').value;
    if (content.trim() === '') {
        alert('JSON is empty. There is nothing to export.');
        return;
    }
    exportJsonFile(content, 'data.json');
});

document.getElementById('export-xml-btn').addEventListener('click', () => {
    const content = document.getElementById('xml-textarea').value;
    if (content.trim() === '') {
        alert('XML is empty. There is nothing to export.');
        return;
    }
    exportXmlFile(content, 'data.xml');
});

// Add server save buttons
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('save-json-server-btn')) {
        document.getElementById('save-json-server-btn').addEventListener('click', () => saveToServer('json'));
    }

    if (document.getElementById('save-xml-server-btn')) {
        document.getElementById('save-xml-server-btn').addEventListener('click', () => saveToServer('xml'));
    }

    if (document.getElementById('load-server-files-btn')) {
        document.getElementById('load-server-files-btn').addEventListener('click', loadServerFiles);
    }
});


window.onload = function () {
    const jsonExample = {
        "full-name": "Joe Doe",
        "email": "joe@example.com",
        "age-group": "25-34",
        "gender": "male",
        "feedback": "Cool!"
    };
    document.getElementById('json-textarea').value = JSON.stringify(jsonExample, null, 2);

    // XML EXAMPLE
    const xmlExample =
        `<survey_data>
            <full-name>Joe Doe</full-name>
            <email>ivan@example.com</email>
            <age-group>25-34</age-group>
            <gender>male</gender>
            <feedback>Cool!</feedback>
        </survey_data>`;
    document.getElementById('xml-textarea').value = xmlExample;

    // Load server files on page load if the element exists
    if (document.getElementById('server-files-list')) {
        loadServerFiles();
    }
};
