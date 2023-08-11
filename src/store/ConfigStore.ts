import { create } from 'zustand';

const settings = {
  sideModalOpen: false,
};

const changeSideModalStatus = ({ set, value }: any) => {
  set({ sideModalOpen: value });
};

const configStoreObject = (set: any) => ({
  ...settings,
  changeSideModalStatus: (value: boolean) =>
    changeSideModalStatus({ set, value }),
});

export const configStore = create(configStoreObject);
