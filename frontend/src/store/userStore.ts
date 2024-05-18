import { create } from "zustand";

interface UserState {
  id: number | null;
  name: string | null;
  profile: string | null;
  emotion: number;

  setId: (id: number | null) => void;
  setName: (id: string | null) => void;
  setProfile: (id: string | null) => void;
  setEmotion: (emotion: number) => void;
}

const userStore = create<UserState>((set) => ({
  id: null,
  name: null,
  profile: null,
  emotion: 0,

  setId: (id) => set({ id }),
  setName: (name) => set({ name }),
  setProfile: (profile) => set({ profile }),
  setEmotion: (emotion) => set({ emotion }),
}));

interface User {
  id: number;
  nickname: string;
  profile: string;
  emotion: number;
}

interface userListState {
  users: User[];

  setUsers: (users: User[]) => void;
  updateUserEmotion: (id: number, emotion: number) => void;
  // updateUser: (user: User) => void;
}

const useUserListStore = create<userListState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  updateUserEmotion: (id, emotion) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, emotion } : user)),
    })),
  // updateUser: (updatedUser) =>
  //   set((state) => ({
  //     users: state.users.map((user) =>
  //       user.id === updatedUser.id ? { ...user, ...updatedUser } : user,
  //     ),
  //   })),
}));

export { useUserListStore, userStore };
