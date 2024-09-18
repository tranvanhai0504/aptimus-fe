import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Application } from "../@types/context";
import { updateApplication } from "../utils/application";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import UploadImage from "./UploadImage";
import { deleteFile, uploadFile } from "../utils/file";

type Inputs = {
  name: string;
  description: string;
};

export default function ChangeAppInforModal({
  isOpen,
  onOpenChange,
  app,
  setApp,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  app: Application | null;
  setApp: React.Dispatch<React.SetStateAction<Application | null>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    setIsSuccess(false);
  }, [isOpen]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!app) return;
    setIsLoading(true);
    let image_url = null;
    if (file) {
      //upload new file
      image_url = await uploadFile(file);

      //delete old file
      const parts = app.image.split("/");
      const oldNameFile = parts[parts.length - 1];
      await deleteFile(oldNameFile);

      if (!image_url) return;
    }

    //update app's information
    const updatedApp = await updateApplication(
      app.id,
      data.name,
      image_url ? image_url : app.image,
      data.description
    );
    updatedApp.provider = [];
    setApp((prev) => {
      if (!prev) return;

      return {
        ...updatedApp,
        private_key: app.private_key,
        public_key: app.public_key,
        providers: prev.providers,
      };
    });
    setIsLoading(false);
    setIsSuccess(true);
    if (updatedApp) {
      setIsSuccess(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() =>
          isSuccess ? (
            <>
              <ModalBody className="flex flex-col justify-center items-center py-10">
                <div className="p-5 rounded-full bg-green/10">
                  <IoIosCheckmarkCircleOutline className="text-5xl text-green" />
                </div>
                <h1 className="text-2xl font-bold">Update app successfully!</h1>
              </ModalBody>
            </>
          ) : (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center">
                <h1 className="text-2xl font-bold">Changing information</h1>
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
                    {...register("name", { required: true, value: app?.name })}
                    errorMessage="Please enter app's name"
                    isInvalid={!!errors.name}
                  />

                  <Input
                    type="text"
                    variant="underlined"
                    label="App Description"
                    {...register("description", {
                      required: true,
                      value: app?.description,
                    })}
                    errorMessage="Please enter app's description"
                    isInvalid={!!errors.description}
                  />
                  {/* include validation with required or other standard HTML validation rules */}

                  <Button
                    type="submit"
                    className="!mt-8 font-bold"
                    isLoading={isLoading}
                  >
                    Submit
                  </Button>
                </form>
              </ModalBody>
            </>
          )
        }
      </ModalContent>
    </Modal>
  );
}
