import { useEffect, useState } from "react"
import { createChoreCompletion, deleteChore, getChores } from "../../managers/choreManager"
import { Button, Table } from "reactstrap"
import { useNavigate } from "react-router-dom"

export const ChoresList = ({ loggedInUser }) => {
    const [chores, setChores] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        getChores().then(setChores)
    }, [])

    const handleCompleteChore = (choreId) => {
        createChoreCompletion(choreId, loggedInUser.id).then(() => {
            getChores().then(setChores)
        })
    }

    return (
        <>
            <h1>Chore List</h1>
            {loggedInUser.roles.includes("Admin") && (
                <Button onClick={() => {
                    navigate("/createchore")
                }}>
                    Create Chore
                </Button>
            )}
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Difficulty</th>
                        <th>Frequency</th>
                        <th>Last Completed On</th>
                        <th>Last Completed By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {chores.map((c) => (
                        <tr key={`chore-${c.id}`}>
                            <th
                                scope="row"
                                style={c.daysSinceLastCompletion > c.choreFrequencyDays ? { color: "red" } : {}}
                            >
                                {c.name}
                            </th>
                            <td>{c.difficulty}</td>
                            <td>{c.choreFrequencyDays} Days</td>
                            <td>
                                {c.choreCompletions?.length > 0
                                    ? c.choreCompletions.slice(-1)[0].completedOn.split("T")[0]
                                    : "No Previous Completion"}
                            </td>
                            <td>
                                {c.choreCompletions?.length > 0
                                    ? `${c.choreCompletions.slice(-1)[0].userProfile.firstName} ${c.choreCompletions.slice(-1)[0].userProfile.lastName}`
                                    : "No Previous Completion"}
                            </td>
                            <td>
                                <Button onClick={() => handleCompleteChore(c.id)}>Complete</Button>
                                {loggedInUser.roles.includes("Admin") && (
                                    <>
                                        <Button
                                            onClick={() => {
                                                navigate(`/choredetails/${c.id}`);
                                            }}
                                        >
                                            View Chore
                                        </Button>
                                        <Button
                                            className="btn-danger"
                                            onClick={() => {
                                                deleteChore(c.id).then(() => {
                                                    getChores().then(setChores);
                                                });
                                            }}
                                        >
                                            Delete Chore
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </Table>
        </>
    )
}