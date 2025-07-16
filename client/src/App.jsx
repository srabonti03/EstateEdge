import HomePage from "./routes/homePage/homePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import Layout from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import AgentProfilePage from "./routes/agentprofilePage/AgentProfilePage";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import SingleAgentPage from "./routes/singleAgentPage/singleAgentPage";
import SingleRecruitmentPage from "./routes/singleRecruitmentPage/singleRecruitmentPage";
import ApplyPage from "./routes/applyPage/applyPage";
import AgentProfileUpdatePage from "./routes/agentProfileUpdatePage/agentProfileUpdatePage";
import AgentPage from "./routes/agentPage/agentPage";
import AdminDashboardPage from "./routes/adminDashboardPage/adminDashboardPage";
import ChatSection from "../src/components/chatSection/chatSection";
import AboutPage from "./routes/aboutPage/aboutPage";
import ContactPage from "./routes/contactPage/contactPage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import NewPostPage from "./routes/newPostPage/newPostPage";
import UpdatePostPage from "./routes/updatePostPage/UpdatePostPage";
import Dashboard from "./components/dashBoard/dashBoard";
import ManageProperties from "./components/manageProperties/manageProperties";
import ManageSoldProperties from "./components/manageSoldProperties/manageSoldProperties";
import ManageAgents from "./components/manageAgents/manageAgents";
import ManageRecruitments from "./components/manageRecruitments/manageRecruitments";
import NewRecruitmentPost from "./components/newRecruitmentPost/newRecruitmentPost";
import UpdateRecruitmentPost from "./components/updateRecruitmentPost/updateRecruitmentPost";
import ViewApplicants from "./components/viewApplicants/viewApplicants";
import SingleRecruitment from "./components/singleRecruitment/singleRecruitment";
import SingleApplicant from "./components/singleApplicant/singleApplicant";
import ProfileSettings from "./components/profileSettings/profileSettings";
import FAQList from "./components/faqList/faqList";
import LocationsList from "./components/locationsList/locationsList";
import TermsAndConditions from "./components/termsAndConditions/termsAndConditions";
import PrivacyPolicy from "./components/privacyPolicy/privacyPolicy";
import CareerList from "./components/careersList/careerList";
import PressList from "./components/pressList/pressList";
import BlogList from "./components/blogList/blogList";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
        },
        {
          path: "/:id",
          element: <SinglePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
        {
          path: "/update/:id",
          element: <UpdatePostPage />,
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
        {
          path: "/profile/:agentId",
          element: <ProfilePage />,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/agentprofile",
          element: <AgentProfilePage />,
        },
        {
          path: "/agent/:agentid",
          element: <SingleAgentPage />,
        },
        {
          path: "/agentprofile/update",
          element: <AgentProfileUpdatePage />,
        },
        {
          path: "/recruitment/:id",
          element: <SingleRecruitmentPage />,
        },
        {
          path: "/recruitment/:id/apply",
          element: <ApplyPage />,
        },
        {
          path: "/admindashboard",
          element: <AdminDashboardPage />,
          children: [
            {
              path: "",
              element: <Dashboard />,
            },
            {
              path: "manageproperties",
              element: <ManageProperties />,
            },
            {
              path: "manageproperties/sold",
              element: <ManageSoldProperties />,
            },
            {
              path: "manageagents",
              element: <ManageAgents />,
            },
            {
              path: "managerecruitments",
              element: <ManageRecruitments />,
            },
            {
              path: "managerecruitments/new",
              element: <NewRecruitmentPost />,
            },
            {
              path: "managerecruitments/update/:id",
              element: <UpdateRecruitmentPost />,
            },
            {
              path: "managerecruitments/:id",
              element: <SingleRecruitment />,
            },
            {
              path: "managerecruitments/:id/applicants",
              element: <ViewApplicants />,
            },
            {
              path: "managerecruitments/:recruitmentId/applicant/:userId",
              element: <SingleApplicant />,
            },
            {
              path: "settings",
              element: <ProfileSettings />,
            },
          ],
        },
        {
          path: "/chatsection",
          element: <ChatSection />,
        },
        {
          path: "/chatsection/:id",
          element: <ChatSection />,
        },
        {
          path: "/about",
          element: <AboutPage />,
        },
        {
          path: "/contact",
          element: <ContactPage />,
        },
        {
          path: "/agent",
          element: <AgentPage />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/faq",
          element: <FAQList />,
        },
        {
          path: "/terms",
          element: <TermsAndConditions />,
        },
        {
          path: "/privacy",
          element: <PrivacyPolicy />,
        },
        {
          path: "/locations",
          element: <LocationsList />,
        },
        {
          path: "/careers",
          element: <CareerList />,
        },
        {
          path: "/press",
          element: <PressList />,
        },
        {
          path: "/blog",
          element: <BlogList />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
