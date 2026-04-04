import { createRoot } from "react-dom/client";
import Tailwindcss from "./Tailwindcss";
import './tailwind.css';
import FormPendaftaranKursus from "./FormPendaftaranKursus";
import UserForm from "./UserForm";

createRoot(document.getElementById("root"))
  .render(
    <div>
      {/* <Tailwindcss /> */}
      <FormPendaftaranKursus/>
      {/* <UserForm/> */}
    </div>
  );