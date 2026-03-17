import { useState } from "react";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Logga in med:", { username, password });
  };

  return (
    <main>
      <h1>Logga in</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Användarnamn</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="password">Lösenord</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <button type="submit">Logga in</button>
      </form>
    </main>
  );
}

export default LoginPage;