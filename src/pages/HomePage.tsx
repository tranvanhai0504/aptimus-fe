import React from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Image,
  Spinner,
} from "@nextui-org/react";
import CreateAppModal from "../components/CreateAppModal";
import { HiOutlinePlus } from "react-icons/hi";
import useAuth from "../hooks/useAuth";
import { getTeams } from "../utils/team";
import { getApplicationsByTeam } from "../utils/application";
import { Application, TeamExtended } from "../@types/context";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [isCreateAppModalOpen, setIsCreateAppModalOpen] = React.useState(false);
  const [teams, setTeams] = React.useState<TeamExtended[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user) return;
    setIsLoading(true);

    const fetchApps = async (team_id: string) => {
      const applications: Application[] = await getApplicationsByTeam(team_id);
      if (!applications) return [];
      return applications;
    };

    const fetchTeams = async () => {
      const teams = await getTeams(user.id);
      const teamsWithApplications = await Promise.all(
        teams.map(async (t: TeamExtended) => {
          t.applications = await fetchApps(t.id);
          return t;
        })
      );
      setTeams(teamsWithApplications);
    };

    fetchTeams();
    setIsLoading(false);
  }, [user, isCreateAppModalOpen]);

  return (
    <div className="flex flex-col space-y-10 items-center">
      <CreateAppModal
        isOpen={isCreateAppModalOpen}
        onOpenChange={setIsCreateAppModalOpen}
        setTeams={setTeams}
      />
      <div className="w-full flex justify-between items-center">
        <span className="flex flex-col">
          <h1 className="text-primary text-3xl font-bold">Dashboard</h1>
          <div className="rounded-full w-fit px-3 py-1 mt-2 text-white bg-primary/80">
            <p>
              Total apps:{" "}
              {teams.reduce(
                (acc, curr) => (acc += curr.applications?.length || 0),
                0
              )}
            </p>
          </div>
        </span>
        <Button
          onClick={() => {
            setIsCreateAppModalOpen(true);
          }}
          className="font-bold border-primary bg-white text-primary"
          variant="bordered"
          endContent={<HiOutlinePlus className="text-primary" />}
        >
          Create new app
        </Button>
      </div>
      {/* <hr className="w-[90%]" /> */}
      {isLoading && <Spinner />}
      <Accordion
        selectionMode="multiple"
        defaultExpandedKeys={[...teams.map((te) => te.id)]}
        variant="splitted"
      >
        {teams.map((t) => (
          <AccordionItem
            key={t.id}
            aria-label={t.name}
            title={<p className="text-grayText">{t.name} Team</p>}
            className="border rounded-lg px-4 mt-4"
          >
            <div className="w-full grid grid-cols-3 gap-4 pb-10 px-4">
              {t.applications?.map((app) => (
                <div
                  key={app.id}
                  className="rounded-lg shadow-lg p-4 backdrop-blur-md bg-white/5"
                >
                  <div className="w-full relative">
                    <Image
                      src={app.image}
                      className="w-full h-40 object-cover"
                      removeWrapper
                      radius="sm"
                    />
                    <Image
                      src="/imgs/wave.svg"
                      className="w-full absolute z-10 -bottom-1"
                      removeWrapper
                      radius="none"
                      draggable={false}
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <span>
                      <h1 className="font-bold text-lg">{app.name}</h1>
                      <p className="text-sm text-grayText">{t.name} team</p>
                    </span>
                    <Button
                      as={Link}
                      className="bg-white border-primary w-fit text-primary hover:bg-primary hover:text-white font-semibold mt-4 self-end"
                      variant="bordered"
                      to={`/app/${app.id}`}
                    >
                      Open App
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default HomePage;
