import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { addProvider } from "../utils/application";
import { Auth_Providers } from "../@types/data";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import { Application } from "../@types/context";

type Inputs = {
  client_id: string;
  type: string;
};

export default function CreateAuthProviderModal({
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!app) return;

    setIsLoading(true);
    const newProvider = await addProvider(app.id, data.type, data.client_id);
    setApp((prev) => {
      if (!prev || !prev.providers) return prev;

      return {
        ...prev,
        providers: [...prev.providers, newProvider],
      };
    });

    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 items-center">
              <div className="flex text-8xl items-center py-5">
                <FcGoogle className="mt-2" />
                <FaApple />
              </div>
              <h1 className="text-2xl font-bold">New Providerrrrrr!</h1>
              <p className="text-sm text-grayText font-semibold">
                Support Google and Apple for now
              </p>
            </ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col pb-4 space-y-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Select
                  variant="underlined"
                  label="Select an provider"
                  className="w-full"
                  {...register("type", {
                    required: true,
                  })}
                  errorMessage="Please select one provider"
                  isInvalid={!!errors.type}
                >
                  {Auth_Providers.filter((p) => {
                    return (
                      app?.providers.findIndex((pro) => pro.type === p) == -1
                    );
                  }).map((p) => (
                    <SelectItem key={p}>{p}</SelectItem>
                  ))}
                </Select>

                <Input
                  type="text"
                  variant="underlined"
                  label="Client ID"
                  {...register("client_id", { required: true })}
                  errorMessage="Please enter app's name"
                  isInvalid={!!errors.client_id}
                />
                {/* include validation with required or other standard HTML validation rules */}

                <Button
                  type="submit"
                  className="!mt-8 font-bold"
                  isLoading={isLoading}
                >
                  Add
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
