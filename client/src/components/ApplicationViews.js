import { Route, Routes } from "react-router-dom"
import { AuthorizedRoute } from "./auth/AuthorizedRoute"
import Login from "./auth/Login"
import Register from "./auth/Register"
import { Home } from "./Home"
import { UserProfileList } from "./userprofile/UserProfileList"
import { UserProfileDetails } from "./userprofile/UserProfileDetails"
import { ChoresList } from "./chores/ChoresList"
import { ChoreDetails } from "./chores/ChoreDetails"
import CreateChore from "./chores/CreateChore"
import { MyChores } from "./chores/MyChores"

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <Home />
            </AuthorizedRoute>
          }
        />
        <Route
          path="userprofiles"
          element={
            <AuthorizedRoute roles={["Admin"]} loggedInUser={loggedInUser}>
              <UserProfileList />
            </AuthorizedRoute>
          }
        />
        <Route
          path="userprofiledetails/:userId"
          element={
            <AuthorizedRoute roles={["Admin"]} loggedInUser={loggedInUser}>
              <UserProfileDetails />
            </AuthorizedRoute>
          }
        />
        <Route
          path="chores"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <ChoresList loggedInUser={loggedInUser} />
            </AuthorizedRoute>
          }
        />
        <Route
          path="choredetails/:choreId"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <ChoreDetails loggedInUser={loggedInUser} />
            </AuthorizedRoute>
          }
        />
        <Route
          path="createchore"
          element={
            <AuthorizedRoute roles={["Admin"]} loggedInUser={loggedInUser}>
              <CreateChore />
            </AuthorizedRoute>
          }
        />
        <Route
          path="mychores/:userId"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <MyChores loggedInUser={loggedInUser} />
            </AuthorizedRoute>
          }
        />
        <Route
          path="login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />
      </Route>
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  )
}
