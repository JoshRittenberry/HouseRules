import { useEffect, useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { createChore } from "../../managers/choreManager";

export default function CreateChore() {
    const [name, setName] = useState("");
    const [difficulty, setDifficulty] = useState(0);
    const [frequency, setFrequency] = useState(0);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const newChore = {
            name: name,
            difficulty: difficulty,
            choreFrequencyDays: frequency,
        };

        createChore(newChore).then(() => {
            navigate("/chores");
        });

        console.log(`new chore created: ${newChore.name}`);
    };

    const handleDifficultyChange = (e) => {
        const newDifficulty = parseInt(e.target.value);
        if (!isNaN(newDifficulty) && newDifficulty >= 0) {
            setDifficulty(newDifficulty);
        }
    };

    const handleFrequencyChange = (e) => {
        const newFrequency = parseInt(e.target.value);
        if (!isNaN(newFrequency) && newFrequency >= 0) {
            setFrequency(newFrequency);
        }
    };

    useEffect(() => {

    }, []);

    return (
        <>
            <h2>Create a Chore</h2>
            <Form>
                <FormGroup>
                    <Label>Name</Label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Difficulty</Label>
                    <Input
                        type="number"
                        value={difficulty}
                        onChange={handleDifficultyChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Chore Frequency</Label>
                    <Input
                        type="number"
                        value={frequency}
                        onChange={handleFrequencyChange}
                    />
                </FormGroup>
                <Button onClick={handleSubmit} color="primary">
                    Submit
                </Button>
            </Form>
        </>
    );
}
