import { create } from 'zustand';

const settings = {
  sideModalOpen: false,
  isSmallScreen: false
};

const changeSideModalStatus = ({ set, value }: any) => {
  set({ sideModalOpen: value });
};

const resizeScreen = ({ set, value }: any) => {
  set({ isSmallScreen: value })
}

const configStoreObject = (set: any) => ({
  ...settings,
  changeSideModalStatus: (value: boolean) =>
    changeSideModalStatus({ set, value }),
  resizeScreen: (value: boolean) =>
    resizeScreen({ set, value }),

});

export const configStore = create(configStoreObject);
