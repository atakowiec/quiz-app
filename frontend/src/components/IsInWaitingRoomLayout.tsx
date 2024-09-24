import { Outlet, Navigate } from "react-router-dom";

interface IsInWaitingRoomLayoutProps {
  isInLobby: boolean;
}

const IsInWaitingRoomLayout = ({ isInLobby }: IsInWaitingRoomLayoutProps) => {
  if (isInLobby) {
    return <Navigate to="/waiting-room" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default IsInWaitingRoomLayout;
