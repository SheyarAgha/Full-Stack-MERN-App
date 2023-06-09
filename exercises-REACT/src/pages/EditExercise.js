import React, { useState } from "react";
import { userState } from 'react';
import { useNavigate } from "react-router-dom";

function EditExercise({ exerciseToEdit }) {

    const [name, setName] = useState(exerciseToEdit.name);
    const [reps, setReps] = useState(exerciseToEdit.reps);
    const [weight, setWeight] = useState(exerciseToEdit.weight);
    const [unit, setUnit] = useState(exerciseToEdit.unit);
    const [date, setDate] = useState(exerciseToEdit.date);

    const navigate = useNavigate();

    const editExercise = async () => {
        const editedExercise = {name, reps, weight, unit, date};
        const response = await fetch(`/exercises/${exerciseToEdit._id}`, { 
            method: 'PUT', 
            body: JSON.stringify(editedExercise),
            headers: {
                'Content-Type': 'application/json',
            }, 
        });
        if (response.status === 200) {
            alert("Successfully edited the exercise");
        } else {
            alert("Failed to edit the exercise");
        }
        navigate("/");
    };

    return (
        <div>
            <h2>Edit an Exercise</h2>
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)} />
            <input
                type="number"
                value={reps}
                onChange={e => setReps(e.target.value)} />
            <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)} />
           <select value={unit} onChange={e => setUnit(e.target.value)}>
                <option disabled selected value>Select a unit</option>
                <option value='lbs'>lbs</option>
                <option value='kgs'>kgs</option>
            </select>
            <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)} />
            <button
                onClick={editExercise}
                >Save</button>
        </div>
    );

};

export default EditExercise;
