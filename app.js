import express from 'express';
import { ItitalizeDatabase, dbAll, dbGet, dbRun } from './util/database.js';


const app = express();
app.use(express.json())


app.get('/timetable', async (req, res) => {
    const timetable = await dbAll("SELECT * FROM timetable");
    res.status(200).json(timetable);
});

app.put('/timetable/:id', async (req, res) => {
    const { id } = req.params;
    const { day, hour, subject } = req.body;
    await dbRun("UPDATE timetable SET day = ?, hour = ?, subject = ? WHERE id = ?", [day, hour, subject, id]);
    res.status(200).json({ message: 'Timetable updated' });
});

app.post('/timetable', async (req, res) => {
    const { day, hour, subject } = req.body;
    await dbRun("INSERT INTO timetable (day, hour, subject) VALUES (?,?,?)", [day, hour, subject]);
    res.status(201).json({ message: 'Timetable created' });
});
app.delete('/timetable/:id', async (req, res) => {
    const { id } = req.params;
    await dbRun("DELETE FROM timetable WHERE id = ?", [id]);
    res.status(200).json({ message: 'Timetable deleted' });
});

async function StartServer() {
    await ItitalizeDatabase();
}

app.listen(3000, async () => {
    console.log('Server is running on port 3000');
    }
);
StartServer();