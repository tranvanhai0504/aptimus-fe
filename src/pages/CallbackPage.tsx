import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
import { jwtDecode } from "jwt-decode";
import { JwtPayloadExtend } from "../@types/context";
import { getUserByEmail, createUser, updateUser } from "../utils/user";
import useAuth from "../hooks/useAuth";

function CallbackPage() {
  const isLoading = useRef(false);
  const switchKeylessAccount = useKeylessAccounts(
    (state) => state.switchKeylessAccount
  );
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
  const idToken = fragmentParams.get("id_token");

  useEffect(() => {
    // This is a workaround to prevent firing twice due to strict mode
    if (isLoading.current) return;
    isLoading.current = true;

    async function deriveAccount(idToken: string) {
      try {
        const account = await switchKeylessAccount(idToken);
        if (account) {
          const jwtDecoded = jwtDecode<JwtPayloadExtend>(account.jwt);

          //check user is exist in db
          let response = await getUserByEmail(jwtDecoded.email);

          if (!response) {
            //create user
            const user = await createUser(
              jwtDecoded.email,
              account.accountAddress.toString()
            );

            if (!user) throw new Error("Failed to create user");
            response = user;
          }

          if (response.wallet_address === "") {
            const res = await updateUser(
              response.id,
              account.accountAddress.toString()
            );

            response.wallet_address = res.wallet_address
          }
          setUser(response);
          localStorage.setItem("account", JSON.stringify(response));
        }
        navigate("/");
      } catch (error) {
        navigate("/login");
      }
    }

    if (!idToken) {
      navigate("/");
      return;
    }

    deriveAccount(idToken);
  }, [idToken, isLoading, navigate, switchKeylessAccount]);

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="relative flex justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed tracking-wider">
        <span className="absolute flex h-3 w-3 -top-1 -right-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        Redirecting...
      </div>
    </div>
  );
}

export default CallbackPage;
