import { useSelector } from "react-redux";
import AdminPanel from "../components/AdminPanel";
import { selectUserIsAdmin } from "../features/auth/selectors";

const Content = () => {
  const isAdmin = useSelector(selectUserIsAdmin);

  return (
    <>
      {isAdmin && (
        <>
          <div className="mb-4" />
          <AdminPanel />
          <div className="mb-4" />
        </>
      )}
    </>
  );
};

export default Content;
