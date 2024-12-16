import { createContext, ReactNode, useState } from "react";
import ProfileModal from "../../pages/profile/components/ProfileModal.tsx";

type ProfileModalContextType = {
  closeModal: () => void;
  showModal: (userId?: number) => void;
}

export const ProfileModalContext = createContext<ProfileModalContextType>({ closeModal: () => {}, showModal: () => {} });

export default function ProfileModalProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);

  function closeModal() {
    setShow(false);
    setUserId(null);
  }

  function showModal(userId?: number) {
    if(!userId) return;

    setUserId(userId);
    setShow(true);
  }

  return (
    <ProfileModalContext.Provider value={{ closeModal, showModal }}>
      {children}
      {userId && <ProfileModal show={show} handleClose={closeModal} userId={userId}/>}
    </ProfileModalContext.Provider>
  );
}