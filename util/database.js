import sqlite from 'sqlite3'

const db = new sqlite.Database('./data/database.sqlite');

export function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

export function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}
export function dbRun(sql, params = []){
    return new Promise((resolve, reject) => {
        db.run(sql,params,function(err){
            if(err){
                reject(err);
            }
            else{
                resolve(this);
            }
        });
    });
}
export async function ItitalizeDatabase(){
    await dbRun("DROP TABLE IF EXISTS timetable");
    await dbRun("CREATE TABLE IF NOT EXISTS timetable (id INTEGER PRIMARY KEY AUTOINCREMENT, day STRING, hour INTEGER, subject STRING)");

    const subjects = ['Math', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 'PE', 'Biology', 'Chemistry'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const lessons = [];

    for (const day of days) {
        for (let hour = 1; hour <= 6; hour++) {
            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            lessons.push({ day, hour, subject });
        }
    }

    for (const lesson of lessons) {
        await dbRun("INSERT INTO timetable (day, hour, subject) VALUES (?,?,?)", [lesson.day, lesson.hour, lesson.subject]);
    }
}