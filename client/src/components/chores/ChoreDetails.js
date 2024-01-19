import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button, Form, FormGroup, Input, Label, Table } from "reactstrap"
import { createChoreAssignment, deleteChoreAssignment, getChoreById, updateChore } from "../../managers/choreManager"
import './choreDetails.css'
import { getUserProfiles } from "../../managers/userProfileManager"

export const ChoreDetails = () => {
    const [chore, setChore] = useState({})
    const [users, setUsers] = useState([])
    const [edit, setEdit] = useState(false)

    const params = useParams()

    useEffect(() => {
        getChoreById(params.choreId).then(setChore)
        getUserProfiles().then(setUsers)
    }, [])

    const handleAssignmentCheckbox = (userId) => {
        if (chore.choreAssignments.some(ca => ca.userProfile.id === userId)) {
            deleteChoreAssignment(chore.id, userId).then(() => {
                getChoreById(chore.id).then(setChore);
            });
        } else {
            createChoreAssignment(chore.id, userId).then(() => {
                getChoreById(chore.id).then(setChore);
            });
        }
    };

    return (
        <>
            <h1>Chore Details</h1>
            {!edit && (
                <Button onClick={() => {
                    setEdit(true)
                }}>
                    Edit Chore
                </Button>
            )}
            {edit && (
                <>
                    <Button className="btn-danger" onClick={() => {
                        getChoreById(chore.id).then(setChore)
                        setEdit(false)
                    }}>
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        var updatedChore = {
                            name: chore.name,
                            difficulty: chore.difficulty,
                            choreFrequencyDays: chore.choreFrequencyDays
                        }
                        updateChore(updatedChore, chore.id).then(() => {
                            getChoreById(params.choreId).then(setChore)
                            setEdit(false)
                        })
                    }}>
                        Save Changes
                    </Button>
                </>
            )}
            <section className="chore-top">
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Difficulty</th>
                            <th>Frequency</th>
                            <th>Last Completed On</th>
                            <th>Last Completed By</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={`chore-${chore.id}`}>
                            {!edit && (
                                <>
                                    <td>{chore.name}</td>
                                    <td>{chore.difficulty}</td>
                                    <td>{chore.choreFrequencyDays}</td>
                                </>
                            )}
                            {edit && (
                                <>
                                    <td>
                                        <Form>
                                            <FormGroup>
                                                <Input
                                                    type="text"
                                                    id="name"
                                                    value={chore.name}
                                                    onChange={(e) => {
                                                        var update = {...chore}
                                                        update.name = e.target.value
                                                        setChore(update)
                                                    }}
                                                />
                                            </FormGroup>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form>
                                            <FormGroup>
                                                <Input
                                                    type="number"
                                                    id="difficulty"
                                                    value={chore.difficulty}
                                                    onChange={(e) => {
                                                        var update = { ...chore }
                                                        update.difficulty = e.target.value
                                                        setChore(update)
                                                    }}
                                                />
                                            </FormGroup>
                                        </Form>
                                    </td>
                                    <td>
                                        <Form>
                                            <FormGroup>
                                                <Input
                                                    type="number"
                                                    id="frequency"
                                                    value={chore.choreFrequencyDays}
                                                    onChange={(e) => {
                                                        var update = { ...chore }
                                                        update.choreFrequencyDays = e.target.value
                                                        setChore(update)
                                                    }}
                                                />
                                            </FormGroup>
                                        </Form>
                                    </td>
                                </>
                            )}
                            <td>
                                {chore.choreCompletions?.length > 0
                                    ? chore.choreCompletions.slice(-1)[0].completedOn.split("T")[0]
                                    : "No Previous Completion"}
                            </td>
                            <td>
                                {chore.choreCompletions?.length > 0
                                    ? `${chore.choreCompletions.slice(-1)[0].userProfile.firstName} ${chore.choreCompletions.slice(-1)[0].userProfile.lastName}`
                                    : "No Previous Completion"}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </section>

            <section className="chore-bottom">
                <section className="chore-left">
                    <Table>
                        {/* Show currently assigned users */}
                        {/* <thead>
                            <tr>
                                <th>Assignments</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chore.choreAssignments?.length > 0 ? (
                                chore.choreAssignments.map(ca => (
                                    <tr key={`choreAssignment-${ca.id}`}>
                                        <td>{ca.userProfile.firstName} {ca.userProfile.lastName}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>There are no Chore Assignments...</td>
                                </tr>
                            )}
                        </tbody> */}

                        {/* Show list of all users to set assignments */}
                        <thead>
                            <tr>
                                <th>Assign Users</th>
                                <th></th>
                            </tr>
                            <tr>
                                <th>Assign</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map(u => (
                                <tr key={u.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={chore.choreAssignments.some(ca => ca.userProfile.id === u.id)}
                                            onChange={() => handleAssignmentCheckbox(u.id)}
                                        />
                                    </td>
                                    <td>{u.firstName} {u.lastName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </section>
                <section className="chore-right">
                    <Table>
                        <thead>
                            <tr>
                                <th>Completions</th>
                                <th></th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Completed On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chore.choreCompletions?.length > 0 ? (
                                chore.choreCompletions.map(cc => (
                                    <tr key={`choreCompletion-${cc.id}`}>
                                        <td>{cc.userProfile.firstName} {cc.userProfile.lastName}</td>
                                        <td>{cc.completedOn.split("T")[0]}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>There are no Chore Completions...</td>
                                    <td></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </section>
            </section>
        </>
    )
}