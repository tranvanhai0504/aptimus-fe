import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Image,
} from "@nextui-org/react";
import { useForm, SubmitHandler } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { createTeam } from "../utils/team";
import { useState } from "react";
import { uploadFile } from "../utils/file";
import UploadImage from "./UploadImage";

type Inputs = {
  name: string;
};

export default function CreateTeamModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const { user, setTeam } = useAuth();
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!user) return;
    if (!file) return;

    const image_url = await uploadFile(file);

    if (!image_url) return;
    const response = await createTeam(data.name, user.id, image_url);
    setTeam(response);
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 items-center">
            <Image src="/imgs/laptop.svg" className="w-1/2" removeWrapper />
            <h1 className="text-2xl font-bold">Start with your team!</h1>
            <p className="text-sm text-grayText font-semibold">
              Team make you go far!
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
                label="Team Name"
                {...register("name", { required: true })}
                errorMessage="Please enter Team's name"
                isInvalid={!!errors.name}
              />
              {/* include validation with required or other standard HTML validation rules */}

              <Button type="submit" className="!mt-8 font-bold">
                Create
              </Button>
            </form>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}
