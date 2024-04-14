import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './SchedulePage.css';
//import io from 'socket.io-client';

const Schedule = () => {
    const [jsonData, setJsonData] = useState(null);
    const URL = `${import.meta.env.REACT_APP_BACKEND_URL}` || 'http://localhost:5000';
    //const socket = io(URL);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                let data = event.target.result;
                // Replace newline characters and other control characters
                data = data.replace(/[\n\r\t\b\f]/g, '');
                let jsonData = JSON.parse(data);

                // Filter jsonData for only "Empty Lab" and "Close the Lab" under the "Course" header
                jsonData = jsonData.filter(item =>
                    item.Course === "Empty Lab" || item.Course === "Close the Lab"
                );

                setJsonData(jsonData);
                console.log(jsonData, "json data");
            } catch (error) {
                alert('Failed to parse JSON file: ' + error.message);
            }
        };

        reader.readAsText(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!jsonData) {
            alert('Please upload a JSON file');
            return;
        }

        try {
            const response = await fetch(`${URL}/schedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            });

            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }

            alert('Schedule uploaded successfully');

            // Emit socket.io event
            //socket.emit('scheduleUploaded', { schedule: jsonData });

        } catch (error) {
            alert('Failed to upload schedule: ' + error.message);
        }
    };

    return (
        <div className='schedule'>
            <Form onSubmit={handleSubmit} className="form-container">
                <Form.Group className="form-group">
                    <Form.Label className="form-label">Upload Schedule</Form.Label>
                    <Form.Control className="form-control" type="file" accept=".json" onChange={handleFileUpload} />
                </Form.Group>

                <Button variant="dark" className="form-button" type="submit">
                    Submit
                </Button>
            </Form>

        </div>
    );
};

export default Schedule;