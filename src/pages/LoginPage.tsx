import { GOOGLE_CLIENT_ID } from "../core/constants";
import useEphemeralKeyPair from "../core/useEphemeralKeyPair";
import GoogleLogo from "../components/GoogleLogo";
import { Button, Link, Image } from "@nextui-org/react";
import { FaApple } from "react-icons/fa";

function LoginPage() {
  const ephemeralKeyPair = useEphemeralKeyPair();

  console.log(`${window.location.origin}/callback`, GOOGLE_CLIENT_ID)

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  const searchParams = new URLSearchParams({
    /**
     * Replace with your own client ID
     */
    client_id: GOOGLE_CLIENT_ID,
    /**
     * The redirect_uri must be registered in the Google Developer Console. This callback page
     * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
     * derive the keyless account.
     *
     * window.location.origin == http://localhost:5173
     */
    redirect_uri: `${window.location.origin}/callback`,
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs as it does not require a backend server.
     */
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.nonce,
  });
  redirectUrl.search = searchParams.toString();

  return (
    <div className="flex items-center justify-center h-screen w-screen px-4 bg-[#525561]/20 bg-login-bg bg-no-repeat bg-cover">
      <div className="w-[85%] h-[80%] bg-white/5 backdrop-blur-lg rounded-2xl p-10 text-white shadow-xl flex flex-col items-center">
        <Image src="/logos/logo-white.svg" />
        <div className="h-full flex flex-col items-center justify-center ">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to <b className="text-primary">Aptimus</b>!{" "}
          </h1>
          <p className="text-lg mb-8 text-white">
            Let's make some magic happen
          </p>
          <Button
            as={Link}
            href={redirectUrl.toString()}
            startContent={<GoogleLogo />}
            className="flex justify-center w-56 font-semibold bg-white rounded-full items-center text-black px-8 py-2 hover:shadow-lg shadow-white active:scale-95 transition-all"
          >
            Sign in with Google
          </Button>
          <Button
            as={Link}
            // href={redirectUrl.toString()}
            startContent={<FaApple className="text-2xl" />}
            disabled
            className="flex w-56 justify-center mt-2 font-semibold bg-white rounded-full items-center text-black px-8 py-2 hover:shadow-lg shadow-white active:scale-95 transition-all"
          >
            Sign in with Apple
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
