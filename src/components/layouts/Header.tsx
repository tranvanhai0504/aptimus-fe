import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKeylessAccounts } from "../../core/useKeylessAccounts";
import { Button } from "@nextui-org/react";
import { LuLogOut } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";

const Header = () => {
  const navigate = useNavigate();
  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();

  useEffect(() => {
    if (!activeAccount) {
      navigate("/login");
    }
  }, [activeAccount, navigate]);

  return (
    <header className="w-full bg-white/10 backdrop-blur-lg py-5 px-10 shadow-sm">
      <div className="w-full flex justify-between">
        <button
          className=""
          onClick={() => {
            navigate(-1);
          }}
        >
          <IoIosArrowBack className="text-white text-2xl" />
        </button>
        <Button
          startContent={<LuLogOut className="text-2xl" />}
          className="text-white bg-primary font-semibold"
          onClick={disconnectKeylessAccount}
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
