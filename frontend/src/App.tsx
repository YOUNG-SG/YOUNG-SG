import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <HasNavbarLayout />,
    children: [
      // 메인페이지
      {
        index: true,
        // element: <MainPage />,
      },
      // 프로필
      {
        path: "/profile",
        // element: <ProfilePage />,
      },
      // 회의 상세
      {
        path: "/meeting/:id",
        // element: <MeetingDetailPage />,
      },
    ],
  },
  // 회의 진행
  {
    path: "/meeting/on/:id",
    // element: <MeetingOnPage />,
  },
  // 로그인
  {
    path: "/login",
    // element: <LoginPage />,
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <div>YOUNG 서기</div>
    </QueryClientProvider>
  );
}

export default App;
