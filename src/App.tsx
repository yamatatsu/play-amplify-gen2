import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

function App() {
	const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

	useEffect(() => {
		const res = client.models.Todo.observeQuery().subscribe({
			next: (data) => setTodos([...data.items]),
		});
		return () => res.unsubscribe();
	}, []);

	const createTodo = () => {
		client.models.Todo.create({ content: window.prompt("Todo content") });
	};

	const deleteTodo = (id: string) => {
		client.models.Todo.delete({ id });
	};

	return (
		<main>
			<h1>My todos</h1>
			<button type="button" onClick={createTodo}>
				+ new
			</button>
			<ul>
				{todos.map((todo) => (
					<div key={todo.id}>
						<li>{todo.content}</li>
						<button type="button" onClick={() => deleteTodo(todo.id)}>
							delete
						</button>
					</div>
				))}
			</ul>
			<div>
				🥳 App successfully hosted. Try creating a new todo.
				<br />
				<a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
					Review next step of this tutorial.
				</a>
			</div>
		</main>
	);
}

export default App;
