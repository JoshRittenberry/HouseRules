import { useEffect, useState } from "react"
import { Button, Table } from "reactstrap"
import { useNavigate } from "react-router-dom"
import { getUserProfileById } from "../../managers/userProfileManager"
import { createChoreCompletion } from "../../managers/choreManager"

export const MyChores = ({ loggedInUser }) => {
    const [user, setUser] = useState({})
    const [assignedChores, setAssignedChores] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        getUserProfileById(loggedInUser.id).then(res => {
            setUser(res)
            setAssignedChores(res.assignedChores.filter(ac => ac.chore?.daysSinceLastCompletion > ac.chore?.choreFrequencyDays))
        })
    }, [])

    const handleCompleteChore = (choreId) => {
        createChoreCompletion(choreId, loggedInUser.id).then(() => {
            getUserProfileById(loggedInUser.id).then(res => {
                setUser(res)
                setAssignedChores(res.assignedChores.filter(ac => ac.chore?.daysSinceLastCompletion > ac.chore?.choreFrequencyDays))
            })
        })
    }

    return (
        <>
            <h1>Chore List</h1>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Difficulty</th>
                        <th>Frequency</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assignedChores.length == 0 && (
                        <td>There are no chores to complete</td>
                    )}
                    {assignedChores.length > 0 && (
                        assignedChores.map((ac) => (
                        <tr key={`chore-${ac.id}`}>
                            <th scope="row">
                                {ac.chore?.name}
                            </th>
                            <td>{ac.chore?.difficulty}</td>
                            <td>{ac.chore?.choreFrequencyDays} Days</td>
                            <td>
                                <Button onClick={() => handleCompleteChore(ac.chore?.id)}>Complete</Button>
                            </td>
                        </tr>
                    )))}
                </tbody>
            </Table>
        </>
    )
}