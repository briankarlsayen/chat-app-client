import { create } from 'zustand';

interface IZustand {
  set?: any;
  get?: any;
}

interface IChangeModalStatus extends IZustand {
  value?: boolean
}

interface IResizeScreen extends IZustand {
  value?: boolean
}

const settings = {
  sideModalOpen: false,
  isSmallScreen: false
};

const changeSideModalStatus = ({ set, value }: IChangeModalStatus) => {
  set({ sideModalOpen: value });
};

const resizeScreen = ({ set, value }: IResizeScreen) => {
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
