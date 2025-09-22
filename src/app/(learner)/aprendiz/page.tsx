import { getUser } from "@/app/api/user-settings";
import { createClient } from "@/utils/supabase/server";
import { differenceInYears } from "date-fns";
import { redirect } from "next/navigation";
import ChildDashboard from "./_components/child-dashboard";

const CHILD_MAX_AGE = 11;
const TEEN_MIN_AGE = 12;

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/dashboard");

  const userData = await getUser(user.id);

  if (!userData) redirect("/dashboard");

  const age = differenceInYears(userData.birthdate, new Date());

  return age <= CHILD_MAX_AGE ? (
    <ChildDashboard user={userData} />
  ) : age >= TEEN_MIN_AGE ? (
    <div>Adolescente</div>
  ) : (
    redirect("/dashboard")
  );
}
