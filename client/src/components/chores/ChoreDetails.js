import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button, Table } from "reactstrap"
import { getChoreById } from "../../managers/choreManager"
import './choreDetails.css'

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
                <section className="chore-left">
                    <Table>
                        <thead>
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