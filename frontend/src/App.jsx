import Body from "./components/Body";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateNote from "./components/CreateNote";
import AddCollab from "./components/AddCollab";
import PublicNote from "./components/PublicNote";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route
              path="home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="create"
              element={
                <ProtectedRoute>
                  <CreateNote />
                </ProtectedRoute>
              }
            />
            <Route
              path="addCollab/:noteId"
              element={
                <ProtectedRoute>
                  <AddCollab />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/public/note/:token" element={<PublicNote />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
