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
import useAuth from "../hooks/useAuth";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Team_user } from "../@types/context";
import { addMemberByEmail } from "../utils/team";

type Inputs = {
  email: string;
};

export default function AddMemberModal({
  isOpen,
  onOpenChange,
  setTeamMembers,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  setTeamMembers: React.Dispatch<React.SetStateAction<Team_user[]>>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { team } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    setIsSuccess(false);

    return () => {
      setIsSuccess(false);
    };
  }, [isOpen]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    if (!team) return;

    const user = await addMemberByEmail(team.id, data.email);

    if (user) {
      setTeamMembers((prev) => {
        if (!prev) return [];

        return [...prev, user.data];
      });
      setIsSuccess(true);
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() =>
          !isSuccess ? (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center">
                <h1 className="text-2xl font-bold">Add New Member</h1>
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col pb-4 space-y-2"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Input
                    type="text"
                    variant="underlined"
                    label="Email"
                    {...register("email", { required: true })}
                    errorMessage="Please enter member's email"
                    isInvalid={!!errors.email}
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
          ) : (
            <>
              <ModalBody className="flex flex-col justify-center items-center py-10">
                <div className="p-5 rounded-full bg-green/10">
                  <IoIosCheckmarkCircleOutline className="text-5xl text-green" />
                </div>
                <h1 className="text-2xl font-bold">
                  Add new member successfully!
                </h1>
              </ModalBody>
            </>
          )
        }
      </ModalContent>
    </Modal>
  );
}
