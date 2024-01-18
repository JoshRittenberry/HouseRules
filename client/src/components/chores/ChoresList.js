import { useEffect, useState } from "react"
import { deleteChore, getChores } from "../../managers/choreManager"
import { Button, Table } from "reactstrap"
import { useNavigate } from "react-router-dom"

export const ChoresList = ({ loggedInUser }) => {
    const [chores, setChores] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        getChores().then(setChores)
    }, [])

    return (
        <>
            <h1>Chore List</h1>
            <Button onClick={() => {
                navigate("/createchore")
            }}>
                Create Chore
            </Button>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Difficulty</th>
                        <th>Frequency</th>
                        {loggedInUser.roles.includes("Admin") && (
                            <th>Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {chores.map(c => {
                        return (
                            <tr key={`chore-${c.id}`}>
                                <th scope="row">{c.name}</th>
                                <td>{c.difficulty}</td>
                                <td>{c.choreFrequencyDays} Days</td>
                                {loggedInUser.roles.includes("Admin") && (
                                    <td>
                                        <Button onClick={() => {
                                            navigate(`/choredetails/${c.id}`)
                                        }}>
                                            View Chore
                                        </Button>
                                        <Button className="btn-danger" onClick={() => {
                                            deleteChore(c.id).then(() => {
                                                getChores().then(setChores)
                                            })
                                        }}>
                                            Delete Chore
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
    )
}