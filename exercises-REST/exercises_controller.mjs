import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as exercises from './exercises_model.mjs';

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

function isDateValid(date) {
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
};

function isValid(name, reps, weight, unit, date) {
    return (
        isDateValid(date) &&
        name.length > 0 &&
        reps > 0 &&
        weight > 0 &&
        (unit === 'lbs' || unit === 'kgs')
    )
};

app.post("/exercises", (req, res) => {
    exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Invalid request' });
        });
});

app.get("/exercises", (req, res) => {
    exercises.getAllExercises()
        .then(exercises => {
            res.status(200).send(exercises);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });
});

app.get("/exercises/:_id", (req, res) => {
    exercises.findExerciseById(req.params._id)
        .then(exercise => {
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        });
});

app.put("/exercises/:_id", (req, res) => {
    if (isValid(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)) {
        exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
            .then(numUpdated => {
                if (numUpdated === 1) {
                    res.json({ _id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date })
                } else {
                    res.status(404).json({ Error: 'Resource not found' });
                }
            })
            .catch(error => {
                console.error(error);
                res.status(400).json({ Error: 'Invalid request' });
            });
    } else {
        res.status(400).json({ Error: 'Invalid request' });
    }
});

app.delete("/exercises/:_id", (req, res) => {
    exercises.deleteExerciseById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
