import { useEffect, useState } from "react"
import { getUserProfiles } from "../../managers/userProfileManager"
import { Button, Table } from "reactstrap"
import { useNavigate } from "react-router-dom"

export const UserProfileList = () => {
    const [profiles, setProfiles] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        getUserProfiles().then(setProfiles)
    }, [])

    return (
        <>
            <h1>User Profile List</h1>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.map(p => {
                        return (
                            <tr key={`profile-${p.id}`}>
                                <th scope="row">{`${p.firstName} ${p.lastName}`}</th>
                                <td>{p.address}</td>
                                <td>
                                    <Button onClick={() => {
                                        navigate(`/userprofiledetails/${p.id}`)
                                    }}>
                                        View Account Details
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
    )
}