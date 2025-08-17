import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import SigninPage from "./pages/signin";
import DashboardPage from "./pages/dashboard";
import SettingPage from "./pages/setting";
import InfoShowPage from "./pages/InfoShow";
import NoteBookPage from "./pages/nootbook";
import PickFieldKindPage from "./pages/pickField";
import ConsultantPage from "./pages/consultantshow";
import StudentPage from "./pages/studentshow";
import FieldPickPage from "./pages/fieldpick";
import AcademicGuidancePage from "./pages/academicguidance";
import PasswordChangePage from "./pages/passwordChange";
import InfoChangePage from "./pages/infoChange";
import FieldsCategoryPage from "./pages/fieldsCategory";

// The Free Pick Pages
import FRFPPage from "./pages/FRFPPage";
import FRSPPage from "./pages/FRSPPage";
import FRTRPage from "./pages/FRTRPage";

// The Free Other Pages
import FRBFPPage from "./pages/FRBFPPage";
import FRBSPPage from "./pages/FRBSPPage";
import FRBTRPage from "./pages/FRBTRPage";

import MajorsPage from "./pages/majorPage";
import FieldsPage from "./pages/fieldPage";
import PasswordPage from "./pages/passwordPage";
import InfoPage from "./pages/infoPage";
import InfoReportPage from "./pages/infoReportPage";
import HoshmandPage from "./pages/Hoshmand";
import ChangeVisibiltyPage from "./helper/changeVisibilty";
import InformationPage from "./pages/information";

function App() {
  const [userRole] = useState(JSON.parse(localStorage.getItem("user-role")));
  return (
    <>
      <Router>
        <Routes>
          {userRole === "ins" ? (
            <>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/consultant_show" element={<ConsultantPage />} />
              <Route path="/student_show" element={<StudentPage />} />
              <Route path="/fieldpick_show" element={<FieldPickPage />} />
              <Route
                path="/academic_guidance"
                element={<AcademicGuidancePage />}
              />
              <Route path="/setting" element={<SettingPage />} />
              <Route path="/changePassword" element={<PasswordChangePage />} />
              <Route path="/changeInfo" element={<InfoChangePage />} />
              <Route
                path="/changeVisibilty"
                element={<ChangeVisibiltyPage />}
              />
              <Route path="/information" element={<InformationPage />} />
              <Route path="/majors" element={<MajorsPage />} />
              <Route path="/fields/:id" element={<FieldsPage />} />
              <Route path="/info_show/:id" element={<InfoShowPage />} />
              <Route path="/fieldsCategory" element={<FieldsCategoryPage />} />
              <Route path="/notebookInfo" element={<NoteBookPage />} />
              {/* <Route
                path="/pffrb/:stu_id/:field/:part"
                element={<FRBFPPage />}
              />
              <Route
                path="/spfrb/:stu_id/:field/:part"
                element={<FRBSPPage />}
              />
              <Route
                path="/trfrb/:stu_id/:field/:part"
                element={<FRBTRPage />}
              />
              <Route path="/pffr/:stu_id/:field" element={<FRFPPage />} />
              <Route path="/spfr/:stu_id/:field" element={<FRSPPage />} />
              <Route path="/trfr/:stu_id/:field" element={<FRTRPage />} /> */}
              <Route path="/*" element={<DashboardPage />} />
            </>
          ) : userRole === "con" ? (
            <>
              {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
              <Route path="/student_show" element={<StudentPage />} />
              <Route path="/fieldpick_show" element={<FieldPickPage />} />
              <Route
                path="/academic_guidance"
                element={<AcademicGuidancePage />}
              />
              <Route path="/setting" element={<SettingPage />} />
              <Route path="/changePassword" element={<PasswordChangePage />} />
              <Route path="/changeInfo" element={<InfoChangePage />} />
              <Route path="/information" element={<InformationPage />} />
              <Route path="/majors" element={<MajorsPage />} />
              <Route path="/fields/:id" element={<FieldsPage />} />
              <Route path="/info_show/:id" element={<InfoShowPage />} />
              <Route path="/fieldsCategory" element={<FieldsCategoryPage />} />
              <Route path="/notebookInfo" element={<NoteBookPage />} />
              {/* <Route path="/pfgl/:stu_id" element={<GLFPPage />} />
              <Route path="/spgl/:stu_id" element={<GLSPPage />} />
              <Route path="/trgl/:stu_id" element={<GLTRPage />} /> */}
              <Route
                path="/pffrb/:stu_id/:field/:part"
                element={<FRBFPPage />}
              />
              <Route
                path="/spfrb/:stu_id/:field/:part"
                element={<FRBSPPage />}
              />
              <Route
                path="/trfrb/:stu_id/:field/:part"
                element={<FRBTRPage />}
              />
              <Route path="/pffr/:stu_id/:field" element={<FRFPPage />} />
              <Route path="/spfr/:stu_id/:field" element={<FRSPPage />} />
              <Route path="/trfr/:stu_id/:field" element={<FRTRPage />} />
              <Route path="/*" element={<DashboardPage />} />
            </>
          ) : userRole === "stu" ? (
            <>
              {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
              <Route path="/pick_field" element={<PickFieldKindPage />} />
              <Route path="/setting" element={<SettingPage />} />
              <Route path="/changePassword" element={<PasswordPage />} />
              <Route path="/changeInfo" element={<InfoPage />} />
              <Route path="/changeReportInfo" element={<InfoReportPage />} />
              <Route path="/majors" element={<MajorsPage />} />
              <Route path="/fields/:id" element={<FieldsPage />} />
              <Route path="/info_show/:id" element={<InfoShowPage />} />
              <Route path="/notebookInfo" element={<NoteBookPage />} />
              <Route path="/pffrb/:field/:part" element={<FRBFPPage />} />
              <Route path="/spfrb/:field/:part" element={<FRBSPPage />} />
              <Route path="/trfrb/:field/:part" element={<FRBTRPage />} />
              <Route path="/pffr/:field" element={<FRFPPage />} />
              <Route path="/spfr/:field" element={<FRSPPage />} />
              <Route path="/trfr/:field" element={<FRTRPage />} />
              <Route path="/entekhab_hoshmand" element={<HoshmandPage />} />
              <Route path="/*" element={<DashboardPage />} />
            </>
          ) : (
            <>
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/*" element={<SigninPage />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
}

export default App;
