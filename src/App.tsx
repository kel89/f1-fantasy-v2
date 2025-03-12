import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useParams,
} from "react-router-dom";

const client = generateClient<Schema>();

// Placeholders -----------------------------------------------
function Home() {
    return <main>This is home</main>;
}

function About() {
    return <main>About Page</main>;
}

function Admin() {
    return <main>Admin Page</main>;
}

function Settings() {
    return <main>Settings Page</main>;
}

function Race() {
    const { id } = useParams<{ id: string }>();
    return <main>Race Page for race {id}</main>;
}
// -----------------------------------------------------------
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/race/:id" element={<Race />} />
            </Routes>
        </Router>
    );

    // return <main>This is home</main>;

    // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

    // useEffect(() => {
    //   client.models.Todo.observeQuery().subscribe({
    //     next: (data) => setTodos([...data.items]),
    //   });
    // }, []);

    // function createTodo() {
    //   client.models.Todo.create({ content: window.prompt("Todo content") });
    // }

    // return (
    //   <main>
    //     <h1>My todos</h1>
    //     <button onClick={createTodo}>+ new</button>
    //     <ul>
    //       {todos.map((todo) => (
    //         <li key={todo.id}>{todo.content}</li>
    //       ))}
    //     </ul>
    //     <div>
    //       🥳 App successfully hosted. Try creating a new todo.
    //       <br />
    //       <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
    //         Review next step of this tutorial.
    //       </a>
    //     </div>
    //   </main>
    // );
}

export default App;
