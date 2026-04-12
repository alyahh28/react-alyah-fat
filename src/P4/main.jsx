import { createRoot } from "react-dom/client";
import Tailwindcss from "./Tailwindcss";
import './tailwind.css';  
import CourseManagerList from "./CourseManagerList";

createRoot(document.getElementById("root"))
  .render(
    <div>
      {/* <Tailwindcss /> */}
      <CourseManagerList/>
    </div>
  );