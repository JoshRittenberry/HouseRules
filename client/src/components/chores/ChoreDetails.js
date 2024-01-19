import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button, Table } from "reactstrap"
import { getChoreById } from "../../managers/choreManager"

export const ChoreDetails = () => {
    const [chore, setProfile] = useState({})

    const params = useParams()

    useEffect(() => {
        getChoreById(params.choreId).then(setProfile)
    }, [])

    return (
        <>
            <h1>Chore Details</h1>
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
                            <th scope="row">{chore.name}</th>
                            <td>{chore.difficulty}</td>
                            <td>{chore.choreFrequencyDays}</td>
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
                {/* <section className="chore-left">
                    <Table>
                        <thead>
                            <tr>
                                <th>Assigned Chores</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chore.assignedChores?.length > 0 ? (
                                chore.assignedChores.map(ac => (
                                    <tr key={`assignedChore-${ac.id}`}>
                                        <td>{ac.chore.name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>There are no assigned chores...</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </section>
                <section className="chore-right">
                    <Table>
                        <thead>
                            <tr>
                                <th>Completed Chores</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chore.completedChores?.length > 0 ? (
                                chore.completedChores.map(cc => (
                                    <tr key={`completedChore-${cc.id}`}>
                                        <td>{cc.chore.name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>There are no completed chores...</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </section> */}
            </section>
        </>
    )
}