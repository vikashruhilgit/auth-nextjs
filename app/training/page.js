import { logout } from "@/actions/auth-actions";
import { Logout } from "@/components/logout";
import { verifyAuth } from "@/lib/auth";
import { getTrainings } from "@/lib/training";
import { redirect } from "next/navigation";

export default async function TrainingPage() {
  const trainingSessions = getTrainings();

  const result = await verifyAuth();

  console.log(result, "result");

  if (!result.session) {
    return redirect("/");
  }

  return (
    <main>
      <h1>Find your favorite activity</h1>
      <Logout />
      <ul id="training-sessions">
        {trainingSessions.map((training) => (
          <li key={training.id}>
            <img src={`/trainings/${training.image}`} alt={training.title} />
            <div>
              <h2>{training.title}</h2>
              <p>{training.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
