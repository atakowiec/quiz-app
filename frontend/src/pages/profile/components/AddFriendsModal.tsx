import { Modal } from "react-bootstrap";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import styles from "../Profile.module.scss";
import { IoMdPerson } from "react-icons/io";
import { BasicUserDetails } from "@shared/user";
import { FriendshipButton, FriendshipButtonProps } from "./FriendshipButton.tsx";
import getApi from "../../../api/axios.ts";

interface AddFriendsModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export default function AddFriendsModal(props: AddFriendsModalProps) {
  const [users, setUsers] = useState<BasicUserDetails[]>([]);
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
  return (
    <div className={`${styles.friend} ${styles.searchFriend}`}>
      <div className={styles.friendIconNick}>
        <div className={styles.friendIcon}>
          {user.username[0]}
        </div>
        <div className={styles.nickStatus}>
          <div className={styles.friendNick}>
            {user.username}
          </div>
        </div>
      </div>
      <div className={styles.rightSide}>
        <FriendshipButton user={user}/>
        <button className={styles.friendModal}>
          <IoMdPerson/>
        </button>
      </div>
    </div>
  )
}