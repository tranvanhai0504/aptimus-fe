import { useState, useEffect } from "react";
import { Application } from "../@types/context";
import { useLoaderData } from "react-router-dom";
import { EphemeralKeyPair, isNumber } from "@aptos-labs/ts-sdk";
import {
  getApplicationInfor,
  updateAPIKeys,
  deleteProvider,
} from "../utils/application";
import { ApplicationResponse } from "../utils/loader";
import CreateAuthProviderModal from "../components/CreateProviderModal";
import ChangeAppInforModal from "../components/ChangeAppInforModal";
import {
  Button,
  Image,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Snippet,
} from "@nextui-org/react";
import { LuPencil } from "react-icons/lu";
import { RiErrorWarningLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import { HiOutlinePlus } from "react-icons/hi";
import { GrCircleQuestion } from "react-icons/gr";
import { MdArrowOutward } from "react-icons/md";
import { LiaTimesSolid } from "react-icons/lia";
import { HiOutlineArrowPath } from "react-icons/hi2";

const ApplicationPage = () => {
  const { applicationId } = useLoaderData() as ApplicationResponse;
  const [app, setApp] = useState<Application | null>(null);
  const [isOpenCreateProvider, setIsOpenCreateProvider] = useState(false);
  const [isOpenChangeInforModal, setIsOpenChangeInforModal] = useState(false);

  const [loadingKeys, setLoadingKeys] = useState(false);

  useEffect(() => {
    if (!applicationId) return;

    async function getData() {
      const data: Application = await getApplicationInfor(applicationId);
      setApp(data);
    }

    getData();
  }, [applicationId]);

  const generateKeys = async () => {
    if (!app) return;

    setLoadingKeys(true);
    const ephemeralKeyPair = EphemeralKeyPair.generate();
    const key = ephemeralKeyPair.getPublicKey().toString().replace("0x00", "");
    const publicKey = key.slice(0, key.length / 2);
    const privateKey = key.slice(key.length / 2, key.length);

    setApp((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        public_key: publicKey,
        private_key: privateKey,
      };
    });

    await updateAPIKeys(app?.id, publicKey, privateKey);

    setLoadingKeys(false);
  };

  const removeAPIKeys = async () => {
    if (!app) return;

    await updateAPIKeys(app?.id, "", "");

    setApp((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        public_key: "",
        private_key: "",
      };
    });
  };

  const removeAuthProvider = async (id: string) => {
    if (!app) return;

    await deleteProvider(id, app.id);

    setApp((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        providers: prev.providers.filter((p) => {
          return p.id !== id;
        }),
      };
    });
  };

  return (
    <div className="flex flex-col space-y-10 items-center px-10">
      <CreateAuthProviderModal
        isOpen={isOpenCreateProvider}
        onOpenChange={setIsOpenCreateProvider}
        app={app}
        setApp={setApp}
      />
      <ChangeAppInforModal
        isOpen={isOpenChangeInforModal}
        onOpenChange={setIsOpenChangeInforModal}
        app={app}
        setApp={setApp}
      />
      <div className="flex w-full space-x-8">
        <Image src={app?.image} className=" w-64 h-32" />
        <div className="flex flex-col justify-between grow">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">{app?.name}</h1>
            <p className="text-grayText text-sm">{app?.description}</p>
          </div>
          <div className="flex space-x-1 items-center text-grayText">
            <p className="text-sm"></p>
          </div>
        </div>
        <div className="">
          <Button
            className="bg-primary/20 text-primary"
            startContent={<LuPencil />}
            onClick={() => {
              setIsOpenChangeInforModal(true);
            }}
          >
            Edit
          </Button>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <div className="w-full flex items-center space-x-4">
          <p className="text-primary font-semibold">Detail</p>
          <hr className="w-full border-t-2 border-primary" />
        </div>
        <div className="grid grid-cols-3 mt-10 gap-5">
          <div className="bg-primary p-5 rounded-xl space-y-4">
            <h1 className="text-white border-b border-white/50 pb-2">
              API Keys
            </h1>
            {app?.private_key !== "" ? (
              <div className="w-full flex flex-col space-y-2">
                <Snippet
                  variant="flat"
                  className="bg-white/20 text-white"
                  symbol={"Public Key: "}
                  codeString={app?.public_key}
                >
                  <p className=" truncate w-56">{app?.public_key}</p>
                </Snippet>
                <Snippet
                  variant="flat"
                  className="bg-white/20 text-white"
                  symbol={"Private Key: "}
                  codeString={app?.private_key}
                >
                  <p className=" truncate w-56">{app?.private_key}</p>
                </Snippet>
                <div className="w-full flex space-x-2">
                  <Button
                    className="w-1/2 bg-white text-primary backdrop-blur-lg"
                    startContent={<LiaTimesSolid />}
                    onClick={removeAPIKeys}
                  >
                    Remove Keys
                  </Button>
                  <Button
                    className="w-1/2 bg-white text-[#32b97c] backdrop-blur-lg"
                    startContent={<HiOutlineArrowPath />}
                    onClick={generateKeys}
                    isLoading={loadingKeys}
                  >
                    Generate new
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center space-y-4">
                <div className="text-xs text-white flex items-center space-x-1">
                  <RiErrorWarningLine className="text-base" />
                  <p>This project is not have any API keys</p>
                </div>
                <Button
                  className="w-full bg-white/20 text-white"
                  variant="faded"
                  onClick={generateKeys}
                >
                  Create new API Keys
                </Button>
              </div>
            )}
          </div>
          <div className="row-span-2 col-span-2 p-5 rounded-xl bg-primary/5 flex flex-col space-y-4 text-primary ">
            <div className="w-full flex justify-between border-b border-primary/50 pb-2 items-center">
              <h1 className="">Auth Providers</h1>
              <Popover color="secondary">
                <PopoverTrigger>
                  <Button
                    variant="flat"
                    className="capitalize bg-primary/20"
                    isIconOnly
                  >
                    <GrCircleQuestion className="text-xl text-primary" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-white text-black">
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">Provider docs:</div>
                    <Link
                      className="text-tiny text-grayText underline"
                      href="https://aptos.dev/en/build/guides/aptos-keyless/oidc-support"
                      target="_black"
                    >
                      https://aptos.dev/en/build/guides/aptos-keyless/oidc-support
                      <MdArrowOutward />
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full grid grid-cols-3 items-center gap-4">
              {app?.providers.map((p) => {
                return (
                  <div
                    key={p.id}
                    className="border rounded-xl border-primary p-5 space-y-3 h-full flex flex-col"
                  >
                    <span className="font-bold flex space-x-2 items-center">
                      {p.type === "Google" ? <FcGoogle /> : <FaApple />}
                      <p>{p.type}</p>
                    </span>
                    <p className="text-xs break-words grow">{p.key}</p>
                    <Button
                      className="w-full bg-primary text-white"
                      onClick={() => {
                        removeAuthProvider(p.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                );
              })}

              {isNumber(app?.providers.length) && app?.providers.length < 2 && (
                <div
                  onClick={() => {
                    setIsOpenCreateProvider(true);
                  }}
                  className="border-2 rounded-xl border-primary p-5 space-y-2 border-dashed h-full cursor-pointer flex items-center justify-center"
                >
                  <HiOutlinePlus className="text-3xl" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
