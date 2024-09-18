import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Image,
} from "@nextui-org/react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { createApplication } from "../utils/application";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import UploadImage from "./UploadImage";
import { uploadFile } from "../utils/file";
import { TeamExtended } from "../@types/context";

type Inputs = {
  name: string;
  description: string;
};

export default function CreateAppModal({
  isOpen,
  onOpenChange,
  setTeams,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  setTeams: (value: React.SetStateAction<TeamExtended[]>) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { team } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    if (!team) return;
    if (!file) return;

    const image_url = await uploadFile(file);

    if (!image_url) return;

    const newApp = await createApplication(
      data.name,
      data.description,
      team?.id,
      image_url
    );

    //add new app to teams data
    setTeams((prev) => {
      if (!prev) return [];

      const newTeamsData = prev.map((t) => {
        if (t.id === team.id) {
          return {
            ...t,
            applications: [...t?.applications, newApp],
          };
        } else {
          return t;
        }
      });

      return newTeamsData;
    });
    setIsLoading(false);
    if (newApp) {
      setIsSuccess(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() =>
          team ? (
            !isSuccess ? (
              <>
                <ModalHeader className="flex flex-col gap-1 items-center">
                  <h1 className="text-2xl font-bold">
                    New app is on your way!
                  </h1>
                  <p className="text-sm text-grayText font-semibold">
                    Create your app and manage
                  </p>
                </ModalHeader>
                <ModalBody>
                  <form
                    className="flex flex-col pb-4 space-y-2"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <UploadImage file={file} setFile={setFile} />

                    <Input
                      type="text"
                      variant="underlined"
                      label="App Name"
                      {...register("name", { required: true })}
                      errorMessage="Please enter app's name"
                      isInvalid={!!errors.name}
                    />

                    <Input
                      type="text"
                      variant="underlined"
                      label="App Description"
                      {...register("description", { required: true })}
                      errorMessage="Please enter app's description"
                      isInvalid={!!errors.description}
                    />
                    {/* include validation with required or other standard HTML validation rules */}

                    <Button
                      type="submit"
                      className="!mt-8 font-bold"
                      isLoading={isLoading}
                    >
                      Create
                    </Button>
                  </form>
                </ModalBody>
              </>
            ) : (
              <>
                <ModalBody className="flex flex-col justify-center items-center py-10">
                  <div className="p-5 rounded-full bg-green/10">
                    <IoIosCheckmarkCircleOutline className="text-5xl text-green" />
                  </div>
                  <h1 className="text-2xl font-bold">
                    Create new app successfully!
                  </h1>
                  <p className="text-sm text-grayText font-semibold">
                    Now you can start with it:D
                  </p>
                </ModalBody>
              </>
            )
          ) : (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center">
                <Image src="/imgs/laptop.svg" className="w-1/2" removeWrapper />
                <h1 className="text-2xl font-bold">Opps!</h1>
                <p className="text-sm text-grayText font-semibold">
                  You don't have any team yet
                </p>
              </ModalHeader>
              <ModalBody className="pb-10">
                <Button
                  as={Link}
                  to={"/team"}
                  className="font-semibold"
                  isLoading={isLoading}
                >
                  Create new team
                </Button>
              </ModalBody>
            </>
          )
        }
      </ModalContent>
    </Modal>
  );
}
