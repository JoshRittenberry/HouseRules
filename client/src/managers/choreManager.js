const _apiUrl = "/api/chore"

export const getChores = () => {
    return fetch(_apiUrl).then((res) => res.json());
}

export const getChoreById = (id) => {
    return fetch(`${_apiUrl}/${id}`).then((res) => res.json());
}

export const createChore = (newChore) => {
    return fetch(_apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newChore),
    }).then((res) => res.json())
}

export const createChoreAssignment = (choreId, userId) => {
    return fetch(`${_apiUrl}/${choreId}/assign?userId=${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    })
}

export const createChoreCompletion = (choreId, userId) => {
    return fetch(`${_apiUrl}/${choreId}/complete?userId=${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    })
}

export const deleteChoreAssignment = (choreId, userId) => {
    console.log(`${_apiUrl}/${choreId}/unassign?userId=${userId}`)
    return fetch(`${_apiUrl}/${choreId}/unassign?userId=${userId}`, {
        method: "DELETE"
    })
}

export const deleteChore = (id) => {
    return fetch(`${_apiUrl}/${id}`, {
        method: "DELETE"
    })
}