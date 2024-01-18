import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getUserProfileById } from "../../managers/userProfileManager"
import { Button, Table } from "reactstrap"
import './userProfileDetails.css'

export const UserProfileDetails = () => {
    const [profile, setProfile] = useState({})

    const params = useParams()

    useEffect(() => {
        getUserProfileById(params.userId).then(setProfile)
    }, [])

    return (
        <>
            <h1>User Profile Details</h1>
            <section className="profile-top">
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th># Assigned</th>
                            <th># Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={`profile-${profile.id}`}>
                            <th scope="row">{`${profile.firstName} ${profile.lastName}`}</th>
                            <td>{profile.address}</td>
                            <td>{profile.assignedChores?.length}</td>
                            <td>{profile.completedChores?.length}</td>
                        </tr>
                    </tbody>
                </Table>
            </section>
            <section className="profile-bottom">
                <section className="profile-left">
                    <Table>
                        <thead>
                            <tr>
                                <th>Assigned Chores</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profile.assignedChores?.length > 0 ? (
                                profile.assignedChores.map(ac => (
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
                <section className="profile-right">
                    <Table>
                        <thead>
                            <tr>
                                <th>Completed Chores</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profile.completedChores?.length > 0 ? (
                                profile.completedChores.map(cc => (
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
                </section>
            </section>
        </>
    )
}