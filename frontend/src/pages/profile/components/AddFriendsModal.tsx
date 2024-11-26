import { Modal } from "react-bootstrap";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import styles from "../Profile.module.scss";
import { IoMdPerson } from "react-icons/io";
import { UserDetails } from "@shared/user";
import { FriendshipButton, FriendshipButtonProps } from "./FriendshipButton.tsx";
import getApi from "../../../api/axios.ts";
import ProfileIcon from "../../../components/ProfileIcon.tsx";
import useProfileModal from "../../../hooks/profile-modal/useProfileModal.ts";

interface AddFriendsModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export default function AddFriendsModal(props: AddFriendsModalProps) {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if(!props.show)
      return;

    fetchUsers(query);
  }, [props.show]);

  const fetchUsers = async (newQuery: string) => {
    const response = await getApi().get(`/users/find-by-name/${newQuery.trim()}`);
    setUsers(response.data ?? []);
  }

  const debouncedFetchUsers = useCallback(
    debounce((newQuery: string) => fetchUsers(newQuery), 500),
    []
  );

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedFetchUsers(e.target.value);
  }

  return (
    <Modal
      show={props.show}
      onHide={() => props.setShow(false)}
      centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Wyszukaj znajomych
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.friendsSearchBox}>
        <input placeholder={"Wyszukaj..."} type={"text"} onChange={handleInput} className={styles.friendsInput}/>
        <div className={styles.searchResult}>
        {
          users.map(user => (
            <UserCard key={user.id} user={user}/>
          ))
        }
        </div>
      </Modal.Body>
    </Modal>
  )
}

function UserCard({ user }: FriendshipButtonProps) {
  const {showModal} = useProfileModal();

  return (
    <div className={`${styles.friend} ${styles.searchFriend}`}>
      <div className={styles.friendIconNick}>
        <ProfileIcon className={styles.friendIcon} iconColor={user.iconColor} username={user.username}/>
        <div className={styles.nickStatus}>
          <div className={styles.friendNick}>
            {user.username}
          </div>
        </div>
      </div>
      <div className={styles.rightSide}>
        <FriendshipButton user={user}/>
        <button className={styles.friendModal} onClick={() => showModal(user.id)}>
          <IoMdPerson/>
        </button>
      </div>
    </div>
  )
}