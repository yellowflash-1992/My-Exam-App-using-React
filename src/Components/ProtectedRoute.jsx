import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ExamStateContext } from "../Helpers/Contexts";

export default function ProtectedRoute() {
  const { userName, waecUserName, selectedSubjects } = useContext(ExamStateContext);
  const location = useLocation();

const isWaecRoute = location.pathname.includes("/new-");

const activeName = isWaecRoute ? waecUserName : userName;

  // STAGE 1: The Name Check
  // If no name, go back to the very start (Landing Page)
 if (!activeName || activeName.trim().length < 2) {
    return <Navigate to="/" replace />;
  }

  // STAGE 2: The Ticket Check (Subjects)
  // We check the "Brain" (State) AND the "Notebook" (LocalStorage)
 const savedSubjects = localStorage.getItem(isWaecRoute ? "waec_subjects" : "exam_subjects");
  const hasSubjects = (selectedSubjects && selectedSubjects.length > 0) || 
                      (savedSubjects && JSON.parse(savedSubjects).length > 0);

  // Define which pages REQUIRE subjects
  const needsSubjects = 
    location.pathname.includes("/exam/") || 
    location.pathname.includes("/exam-config") ||
    location.pathname.includes("/exam-menu");
    location.pathname.includes("/new-exam-page"); // Added WAEC exam page

  // If they are trying to go to an exam page but have no subjects...
  if (needsSubjects && !hasSubjects) {
    // ...send them to the selection page to pick some!
   return <Navigate to={isWaecRoute ? "/new-select-subject" : "/select-subject"} replace />;
  }

  // If they passed all checks, let them in!
  return <Outlet />;
}