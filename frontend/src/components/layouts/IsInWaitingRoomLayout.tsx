import { Navigate, Outlet } from "react-router-dom";

interface IsInWaitingRoomLayoutProps {
  isInLobby: boolean;
  ifHasToBeNavigatedTo: boolean;
}

const IsInWaitingRoomLayout = ({
  isInLobby,
  ifHasToBeNavigatedTo,
}: IsInWaitingRoomLayoutProps) => {
  if (isInLobby && ifHasToBeNavigatedTo) {
    return <Navigate to="/waiting-room" />;
  }
  if (!isInLobby && !ifHasToBeNavigatedTo) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default IsInWaitingRoomLayout;
