import { Authenticator, translations } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import { I18n } from "aws-amplify/utils";
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";

I18n.putVocabularies(translations);
I18n.setLanguage("ja");

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
		<Authenticator hideSignUp>
			{({ signOut, user }) => (
				<main>
					<h1>{user?.signInDetails?.loginId}'s todos</h1>
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
					</div>{" "}
					<button type="button" onClick={signOut}>
						Sign out
					</button>
				</main>
			)}
		</Authenticator>
	);
}

export default App;
